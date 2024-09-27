import http from 'node:http';
import url from 'node:url';
import alt from 'alt-server';
import { inject, injectable } from 'inversify';
import { normalizeIP } from '@/tools/normalizeIp';
import { $global } from '@/_magic/inversify.tokens';

@injectable()
export class DevScript {

    start() {
        alt.once('serverStarted', async () => {
            void this.reconnectClients();
            console.log(`🛠️ Dev | Graceful shutdown server started`);

            http.createServer((req, res) => {
                const parsedUrl = url.parse(req.url as string, true);
                const pathname = parsedUrl.pathname;

                // Обработка маршрутов
                if (pathname === '/RESTART') {
                    console.log('🛠️ Dev | Stop command from daemon, kick all players...');

                    const ipList: string[] = [];
                    alt.Player.all.forEach((player) => {
                        ipList.push(normalizeIP(player.ip));
                        player.kick('Please wait...');
                    });

                    res.end(JSON.stringify(ipList));
                    alt.stopServer();
                }
            }).listen(7781);

            fetch(`http://127.0.0.1:7780/SERVER_READY`)
                .then(() => {
                    // console.log('🛠️ Dev | SERVER_READY command sent')
                })
                .catch(error => {
                    console.log('🛠️ Dev | Fail to send SERVER_READY command.', error.message)
                });
        });
    }

    private reconnectClients() {
        if(process.env.DEV_RECONNECT_IP_LIST) {
            console.log('ip_LIST', JSON.stringify(process.env.DEV_RECONNECT_IP_LIST));
        }
        // this.config.dev.gs_player_reconnect_ip_list.forEach(async (ip) => {
        //     console.log('Reconnect:', ip);
        //     fetch(`http://${ip}:${9223}/reconnect`, {
        //         method: 'POST',
        //         body: '',
        //     }).catch(() => {});
        // });
    }
}
