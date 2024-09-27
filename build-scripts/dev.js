import path from "node:path";
import {DevServerDaemon} from "./serve.js";
import {watchClient, watchServer} from "./tools.dev.js";
import fse from "fs-extra";
import dotenv from 'dotenv'

const ROOT_DIR = path.join(import.meta.dirname, '..')
const SRC_DIR = path.join(ROOT_DIR, 'src')
const BIN_DIR = path.join(import.meta.dirname, '..', 'bin')
const RESOURCES_DIR = path.join(BIN_DIR, 'resources');
const SERVER_CORE_RESOURCE_DIR = path.join(RESOURCES_DIR, 'core');

const ENV_FILE_STRING = fse.readFileSync(path.join(ROOT_DIR, '.env'), 'utf8');
const SERVER_ENV = dotenv.parse(ENV_FILE_STRING)

const serve = async () => {
    const serverEE = await watchServer(ROOT_DIR, path.join(SRC_DIR, 'server'), path.join(SERVER_CORE_RESOURCE_DIR, 'server'))
    const clientEE = await watchClient(ROOT_DIR, path.join(SRC_DIR, 'client'), path.join(SERVER_CORE_RESOURCE_DIR, 'client'))

    let isServerInitialReady = false
    let isClientInitialReady = false

    serverEE.once('ok', () => onFirstOk('server'))
    clientEE.once('ok', () => onFirstOk('client'))

    const onFirstOk = (type) => {
        if(type === 'server') {
            isServerInitialReady = true
        } else {
            isClientInitialReady = true
        }

        if(isServerInitialReady && isClientInitialReady) onInitialReady()
    }

    const onInitialReady = () => {
        // console.clear()
        console.log('✅  Watch ready')

        const daemon = new DevServerDaemon(BIN_DIR, SERVER_ENV)

        serverEE.on('ok', () => {
            console.log('Server successful built')
            daemon.restartRequest()
        })

        clientEE.on('ok', () => {
            console.log('Client successful built')
            daemon.restartRequest()
        })

        daemon.start()
    }

    serverEE.on('error', (err) => {
        console.clear()
        console.log('❌  Server build error\n')
        process.stderr.write(err)
    })

    serverEE.on('warning', (warning) => {
        console.clear()
        console.log('⚠️  Server warning\n')
        process.stdout.write(warning)
    })


    clientEE.on('error', (err) => {
        console.clear()
        console.log('❌  Client build error\n')
        process.stderr.write(err)
    })

    clientEE.on('warning', (warning) => {
        console.clear()
        console.log('⚠️  Client warning\n')
        process.stdout.write(warning)
    })
}

void serve()