import child_process from "node:child_process";
import EventEmitter from "events";
import ESBuild from "esbuild";
import {getClientConfig, getServerConfig} from "./build.config.js";

export const downloadAltVPackages = async (BIN_DIR) => new Promise((resolve) => {
    const cp = child_process.exec('npx altv-pkg release', { cwd: BIN_DIR })
    cp.stdout.on('data', (data) => process.stdout.write(data))
    cp.on('exit', resolve)
})

const createServeStatusPlugin = () => {
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

export const watchServer = async (ROOT_DIR, SRC_DIR, CORE_RESOURCE_DIR) => {
    const config = getServerConfig(ROOT_DIR, SRC_DIR, CORE_RESOURCE_DIR, 'development');
    const { ee, plugin } = createServeStatusPlugin()
    config.plugins.push(plugin)
    const ctx = await ESBuild.context({ ...config, logLevel: 'silent' });
    await ctx.watch()
    return ee;
}

export const watchClient = async (ROOT_DIR, SRC_DIR, CORE_RESOURCE_DIR) => {
    const config = getClientConfig(ROOT_DIR, SRC_DIR, CORE_RESOURCE_DIR, 'development');
    const { ee, plugin } = createServeStatusPlugin()
    config.plugins.push(plugin)
    const ctx = await ESBuild.context({ ...config, logLevel: 'silent' });
    await ctx.watch()
    return ee
}