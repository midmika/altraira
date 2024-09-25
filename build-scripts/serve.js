import http from "node:http";
import url from "node:url";

export class DevServerDaemon {

    is_up = false
    is_in_action = false
    is_wanna = false

    last_reconnect_ip_list = []

    constructor() {
        http.createServer((req, res) => {
            const parsedUrl = url.parse(req.url, true);
            const pathname = parsedUrl.pathname;
            if(pathname === '/SERVER_READY') this.#onServerUp()
            res.end()
        }).listen(7780);
    }

    #onServerUp() {
        console.log('✅  Server started')
        this.is_up = true
        this.is_in_action = false
    }

    async start() {
        this.is_in_action = true;
        //todo: start server
        this.is_in_action = false
    }

    restartRequest() {
        if(!this.is_up && this.is_in_action) {
            this.is_wanna = true
            return;
        }

        void this.#restart()
    }

    async #restart() {
        try {
            this.is_in_action = true
            this.is_up = false
            console.log('Sending #restart command...')
            const res = await fetch('http://127.0.0.1:7781/restart', { method: 'POST' })
            const reconnect_ips_list = await res.json()
            this.last_reconnect_ip_list = reconnect_ips_list
            if(reconnect_ips_list) {
                console.log('Received reconnect ips list: ', reconnect_ips_list.join(', '))
            }
        } catch (error) {
            console.log("❌  Fail to #restart server.", error)
        } finally {
        }
    }

}