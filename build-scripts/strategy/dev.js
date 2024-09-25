import path from "node:path";
import {getClientConfig, getServerConfig} from "../build.config.js";
import ESBuild from "esbuild";
import { build as ViteBuild } from 'vite';
import EventEmitter from "events";
import {DevServerDaemon} from "../serve.js";

const createServerPlugin = () => {
    const ee = new EventEmitter()

    const plugin = {
        name: 'start/end',
        setup(build) {
            build.onStart(() => {
                ee.emit('start')
            })
            build.onEnd(async (result) => {
                if(result.errors.length) {
                    const _= await ESBuild.formatMessages([result.errors[0]], { kind: 'error' })
                    ee.emit('error', _[0])
                } else if(result.warnings.length) {
                    const _= await ESBuild.formatMessages([result.warnings[0]], { kind: 'warning' })
                    ee.emit('warning', _[0])
                } else {
                    ee.emit('ok')
                }
            })
        }
    }

    return { ee, plugin }
}

const serveServer = async (rootDir, srcDir, outDir) => {
    const config = getServerConfig(rootDir, srcDir, outDir, 'prod');
    const { ee, plugin } = createServerPlugin()
    config.plugins.push(plugin)
    const ctx = await ESBuild.context({ ...config, logLevel: 'silent' });
    await ctx.watch()
    return ee;
}

const serveClient = async (rootDir, srcDir, outDir) => {
    const config = getClientConfig(rootDir, srcDir, outDir, 'prod');
    const { ee, plugin } = createServerPlugin()
    config.plugins.push(plugin)
    const ctx = await ESBuild.context({ ...config, logLevel: 'silent' });
    await ctx.watch()
    return ee
}

const buildWeb = async (rootDir, srcDir, outDir) => {
    const config = {
        root: srcDir,
        base: '/client/web/',
        build: {
            outDir: outDir,
            minify: 'terser'
        },
        resolve: {
            alias: {
                '@/shared': path.join(srcDir, '..', 'shared'),
                '@': path.join(srcDir, './src'),
            },
        },
    };

    await ViteBuild(config)
}

export const serveStrategy = async (rootDir, srcDir, coreResourceDir) => {

    const serverEE = await serveServer(rootDir, path.join(srcDir, 'server'), path.join(coreResourceDir, 'server'))
    const clientEE = await serveClient(rootDir, path.join(srcDir, 'client'), path.join(coreResourceDir, 'client'))

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



    // try {
    //     await Promise.all([
    //         buildServer(rootDir, path.join(srcDir, 'server'), path.join(coreResourceDir, 'server')),
    //         buildClient(rootDir, path.join(srcDir, 'client'), path.join(coreResourceDir, 'client')),
    //         buildWeb(rootDir, path.join(srcDir, 'web'), path.join(coreResourceDir, 'client', 'web')),
    //     ])
    // } catch (error) {
    //     console.log('Fatal error')
    //     console.log(error)
    //     process.exit(1)
    // }
}