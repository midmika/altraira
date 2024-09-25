import path from "node:path";
import fse from "fs-extra";
import {DevServerDaemon} from "./serve.js";
import {downloadAltVPackages, watchClient, watchServer} from "./tools.dev.js";

const ROOT_DIR = path.join(import.meta.dirname, '..')
const SRC_DIR = path.join(ROOT_DIR, 'src')
const BIN_DIR = path.join(import.meta.dirname, '..', 'bin')
const RESOURCES_DIR = path.join(BIN_DIR, 'resources');
const SERVER_CORE_RESOURCE_DIR = path.join(RESOURCES_DIR, 'core');


fse.copyFileSync(
    path.join(ROOT_DIR, '.altvpkgrc.json'),
    path.join(ROOT_DIR, '.altvpkgrc.json'),
)

const spawnServer = async () => {

}

const serve = async () => {
    
    await downloadAltVPackages(BIN_DIR)

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
        console.clear()
        console.log('✅  Watch ready')

        const daemon = new DevServerDaemon()

        serverEE.on('ok', () => {
            daemon.restartRequest()
            console.log('Server successful built')
        })

        clientEE.on('ok', () => {
            daemon.restartRequest()
            console.log('Client successful built')
        })
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

const index = async () => {
    fse.mkdirSync(RESOURCES_DIR)
    fse.mkdirSync(SERVER_CORE_RESOURCE_DIR)
    fse.mkdirSync(SERVER_CORE_RESOURCE_DIR)

    let serverToml = path.join(ROOT_DIR, 'altv', 'server.dev.toml')

    fse.copySync(
        path.join(serverToml),
        path.join(BIN_DIR, 'server.toml'),
    )

    fse.copySync(
        path.join(ROOT_DIR, 'altv', 'resource.toml'),
        path.join(SERVER_CORE_RESOURCE_DIR, 'resource.toml'),
    )
    
    fse.copySync(
        path.join(ROOT_DIR, 'kysely'),
        path.join(SERVER_CORE_RESOURCE_DIR, 'kysely'),
    )
}

void index()