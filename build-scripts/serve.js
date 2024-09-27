import http from "node:http";
import url from "node:url";
import {spawn} from "node:child_process";
import path from "node:path";
import EventEmitter from "events";

export class DevServerDaemon {

    is_up = false
    is_in_action = false
    is_wanna = false

    #can_restart = false

    #last_reconnect_ip_list = []

    #BIN_DIR
    #SERVER_ENV

    #ee = new EventEmitter()

    constructor(BIN_DIR, SERVER_ENV) {
        http.createServer((req, res) => {
            const parsedUrl = url.parse(req.url, true);
            const pathname = parsedUrl.pathname;
            if(pathname === '/SERVER_READY') this.#ee.emit('up')
            res.end()
        }).listen(7780);

        this.#BIN_DIR = BIN_DIR
        this.#SERVER_ENV = SERVER_ENV
    }


    async start() {
        this.#can_restart = false
        await this.#spawn()
        this.#can_restart = true
    }

    restartRequest() {
        if(!this.#can_restart) {
            this.is_wanna = true
            return;
        }

        void this.#restart()
    }

    async #spawn() {
        return new Promise((resolve, reject) => {

            const process = spawn(
                path.join(this.#BIN_DIR, 'altv-server.exe'),
                {
                    env: {
                        NODE_ENV: 'development', ...this.#SERVER_ENV,
                        DEV_RECONNECT_IP_LIST: this.#last_reconnect_ip_list.join(', ').toString()
                    },
                    cwd: this.#BIN_DIR, stdio: ['inherit', 'inherit', 'inherit']
                },
            );

            process.once('close', (code) => {
                this.#ee.emit('down', true)
                if(code !== 0) reject(code)
            });

            process.on('error', (error) => {
                console.error('alt:V Server Error');
                console.error(error);
            });

            this.#ee.once('up', () => {
                console.log('✅  Server started')
                resolve()
            })
        })
    }

    async #waitStop() {
        return new Promise((r) => {
            this.#ee.once('down', r)
        })
    }

    async #restart() {
        try {
            this.#can_restart = false
            console.log('Sending #restart command...')
            const [res] = await Promise.all([
                fetch('http://127.0.0.1:7781/RESTART', { method: 'POST' }),
                this.#waitStop()
            ])
            const reconnect_ips_list = await res.json()

            this.#last_reconnect_ip_list = reconnect_ips_list
            if(reconnect_ips_list) {
                console.log('Received reconnect ips list: ', reconnect_ips_list.join(', '))
            }
            await this.#spawn()
            this.#can_restart = true
        } catch (error) {
            console.log("❌  Fail to #restart server.", error)
        } finally {
            if(this.is_wanna) {
                this.is_wanna = false
                this.#can_restart = false
                void this.#restart()
            }
        }
    }

}