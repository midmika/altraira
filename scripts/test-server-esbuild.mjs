import { Builder } from './esbuild/builder.mjs';
import { Terminal } from './esbuild/terminal.mjs';
import fse from 'fs-extra';
import path from 'path';
import { Altv } from './esbuild/altv.mjs';
import { fileURLToPath } from 'node:url';

const binDir = path.join(import.meta.dirname, '..', 'docker', 'altv-server-dev')
const resourcesDir = path.join(binDir, 'resources', 'core')

const start = async () => {

    const isResourcesExists = fse.existsSync(resourcesDir);
    if (!isResourcesExists) {
        await fse.mkdirs(resourcesDir);
    } else {
        // await fse.emptyDir(resourcesDir);
    }

    const serverBuilder = new Builder('server')
    const serverWatcher = await serverBuilder.watch()

    const clientBuilder = new Builder('client')
    const clientWatcher = await clientBuilder.watch()

    const altv = new Altv(binDir, true)

    let isFirstServer = true
    let isFirstClient = true

    // const terminal = new Terminal()
    // altv-server-dev.ee.on('message', terminal.emitLog.bind(terminal))
    altv.ee.on('state', (state, error) => {
        // terminal.setAltVState(state)
        // if(error) terminal.setAltVError([error])
    })

    // void altv-server-dev.restartRequest()

    const onClientStart = () => {
        // terminal.setClientState('build')
    }

    const onClientResult = (errorsString) => {
        if(errorsString) {
            // terminal.setClientState('error')
            // terminal.setClientError(errorsString)
        } else {
            // terminal.setClientState('ok')
            console.log('client built')
            if(isFirstClient) {
                isFirstClient = false
                if(!isFirstServer) altv.restartRequest('server.client_also_ready')
            } else {
                altv.restartRequest('server.normal')
            }
        }
    }

    const onServerStart = () => {
        // terminal.setServerState('build')
    }

    const onServerResult = (errorsString) => {
        if(errorsString) {
            // terminal.setServerState('error')
            // terminal.setServerError(errorsString)
        } else {
            // terminal.setServerState('ok')
            console.log('server built')
            if(isFirstServer) {
                isFirstServer = false
                if(!isFirstClient) altv.restartRequest('server.client_also_ready')
            } else {
                altv.restartRequest('server.normal')
            }
        }
    }

    clientWatcher.on('start', onClientStart)
    clientWatcher.on('result', onClientResult)
    serverWatcher.on('start', onServerStart)
    serverWatcher.on('result', onServerResult)

}

void start()

process.on('uncaughtException', console.error)
process.on('unhandledException', console.error)