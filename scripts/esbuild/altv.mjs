import fse from 'fs-extra';
import path from 'node:path';
import child_process from 'node:child_process';
import EventEmitter from 'events';
import { objToToml } from './objToToml.js';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import chokidar from 'chokidar';

class ServerInstance {

    #exeDir
    #binDir
    #ipcFile

    #instance

    #isStarted
    #isDestroyed

    #onFatalCb

    #watcher

    #isNormalKilled = false

    constructor(exeDir, binDir, ipcFile) {
        this.#exeDir = exeDir;
        this.#binDir = binDir
        this.#ipcFile = ipcFile;
    }

    start() {
        return new Promise((r) => {

            fs.writeFileSync(this.#ipcFile, '')
            const c = chokidar.watch(this.#ipcFile)

            c.on('change', (change) => {
                const c = fs.readFileSync(this.#ipcFile, 'utf8');
                const lines = c.split('\n');
                const message = lines.filter(line => line.trim() !== '').pop();
                if(!message) return;
                if(message === 'server:ready') this.#isStarted = true
            })

            this.#watcher = c

            const instance = child_process.spawn(this.#exeDir, {
                cwd: this.#binDir,
                stdio: ['inherit', 'inherit', 'inherit'],
            });

            instance.once('exit', (code) => {
                if(!this.#isNormalKilled) this.#onFatalCb(code)
            })

            instance.once('error', (error) => {
                console.log('====== SERVER ERROR =======')
                console.log(error)
                instance.kill('SIGABRT')
                this.#isDestroyed = true
            })

            this.#instance = instance

            if(this.#isStarted) {
                r()
            } else {
                let i = setInterval(() => {
                    if(this.#isStarted) {
                        clearInterval(i)
                        r()
                    }
                }, 10)
            }
        })
    }

    async kill() {
        return new Promise(async (r) => {
            await this.#watcher.close()
            this.#isNormalKilled = true
            this.#instance.once('exit', r)
            fs.appendFileSync(this.#ipcFile, 'daemon:stop\n')
        })
    }

    onFatal(cb) {
        this.#onFatalCb = cb
    }


    get isStarted() {
        return this.#isStarted
    }

    get isDestroyed() {
        return this.#isDestroyed
    }

}

export class Altv {
    #isDev
    #binDir
    #exeDir

    #currentServer
    #isLoading = false
    #isWanna

    ee

    #ipcFile = path.join(fileURLToPath(import.meta.url), '..', '..', '..', 'dev', 'ipc');

    constructor(binDir, isDev = false) {
        this.#binDir = binDir
        this.#exeDir = path.join(binDir, 'altv-server-dev-server.exe')
        this.#isDev = isDev
        this.ee = new EventEmitter()

        this.#writeResourceConfig()
    }

    async restartRequest(reason) {
        console.log('=== Restart request!!', reason)
        // if(this.#isLoading) {
        //     this.#isWanna = true
        //     return;
        // }
        //
        // this.#isLoading = true
        //
        // await this.#currentServer?.kill()
        // if(this.#isWanna) this.#isWanna = false
        //
        // const i = new ServerInstance(this.#exeDir, this.#binDir, this.#ipcFile)
        // this.#currentServer = i
        //
        // i.onFatal((code) => {
        //     console.log('Server fatal!!', code)
        // })
        //
        // await i.start()
        // console.log(`---- Server started ----`)
        //
        // // setTimeout(async () => {
        // //    await i.kill()
        // //     console.log('Server closed!')
        // // }, 1000)
        //
        // this.#isLoading = false
        // if(this.#isWanna) void this.restartRequest('auto')
    }

    #onProcessStdout(message) {
        let t = message.split("\n")
        if(t[0] === '%%serverStarted%%') {
            this.ee.emit('state', 'ok')
            this.#isLoading = false
            return;
        }
        if(t[t.length - 1] === '') t = t.splice(0, t.length - 1)
        this.ee.emit('message', t)
    }

    #writeResourceConfig() {
        const serverConfig = {
            announce: false,
            description: 'test',
            website: 'test.com',
            gamemode: 'Role Play',
            language: 'ru',
            modules: ['js-module'],
            name: 'Test Server',
            players: 1048,
            tags: [],
            resources: ['core'],
            debug: this.#isDev,
            host: '0.0.0.0',
            port: 7788,
            'js-module': {
                'global-webcrypto': true,
                'global-fetch': true,
                'source-maps': true,
                // 'heap-profiler': true,
                // 'profiler': true,
                'network-imports': true,
            },
            'extra-cli-args': ["--max-old-space-size=8192"],
            'worldProfiler': {
                port: 7797,
                host: '0.0.0.0',
            }
            // voice: { bitrate: 64000, test: 1 },
        };

        const coreToml = {
            type: 'js',
            main: 'server/index.js',
            'client-files': ['client/*'],
            'client-main': 'client/index.js',
            deps: [],
        };

        const serverToml = objToToml(serverConfig)
        fse.writeFileSync(path.join(this.#binDir, 'server.toml'), serverToml);

        const coreResourceToml = objToToml(coreToml)
        fse.writeFileSync(path.join(this.#binDir, 'resources', 'core', 'resource.toml'), coreResourceToml);
    }

}