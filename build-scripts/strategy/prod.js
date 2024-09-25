import path from "node:path";
import {getClientConfig, getServerConfig} from "../build.config.js";
import ESBuild from "esbuild";
import { build as ViteBuild } from 'vite';

const buildServer = async (rootDir, srcDir, outDir) => {
    const config = getServerConfig(rootDir, srcDir, outDir, 'prod');
    const res = await ESBuild.build(config)
    const firstError = res.errors[0]
    if(firstError) {
        console.log('Fatal client build')
        throw firstError
    }
}

const buildClient = async (rootDir, srcDir, outDir) => {
    const config = getClientConfig(rootDir, srcDir, outDir, 'prod');
    const res = await ESBuild.build(config)
    const firstError = res.errors[0]
    if(firstError) {
        console.log('Fatal client build')
        throw firstError
    }
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

export const buildProduction = async (rootDir, srcDir, coreResourceDir) => {
    try {
        await Promise.all([
            buildServer(rootDir, path.join(srcDir, 'server'), path.join(coreResourceDir, 'server')),
            buildClient(rootDir, path.join(srcDir, 'client'), path.join(coreResourceDir, 'client')),
            buildWeb(rootDir, path.join(srcDir, 'web'), path.join(coreResourceDir, 'client', 'web')),
        ])
    } catch (error) {
        console.log('Fatal error')
        console.log(error)
        process.exit(1)
    }
}