import ESBuild from 'esbuild';
import EventEmitter from 'events';
import { copy } from 'esbuild-plugin-copy';
import path from 'path';
import fs from 'fs';
import toml from 'toml';
import { objToToml } from './objToToml.js';
import { NodeResolvePlugin } from '@esbuild-plugins/node-resolve'
import { builtinModules } from "node:module"
import { nodeExternalsPlugin } from 'esbuild-node-externals';

export class Builder {

    #srcDir = 'src';
    #resourcesDir = 'docker/altv-server-dev/resources/core';

    #isRunning = false
    type

    constructor(type) {
        this.type = type;
    }

    async build() {
        if(this.#isRunning) throw new Error('Already started!')
        this.#isRunning = true
        const result = await ESBuild.build(this.#generateConfig())
        if(result.errors.length) throw result.errors[0]
    }

    async watch() {
        if(this.#isRunning) throw new Error('Already started!')
        this.#isRunning = true

        const config = this.#generateConfig()

        const ee = new EventEmitter()

        const eePlugin = {
            name: 'start/end',
            setup(build) {
                build.onStart(() => {
                    ee.emit('start')
                })
                build.onEnd(async (result) => {
                    if(result.errors.length) {
                        const _= await ESBuild.formatMessages([result.errors[0]], { kind: 'error' })
                        ee.emit('result', _[0].split('\n'))
                    } else if(result.warnings.length) {
                        const _= await ESBuild.formatMessages([result.warnings[0]], { kind: 'warning' })
                        ee.emit('result', _[0].split('\n'))
                    } else {
                        ee.emit('result', null)
                    }
                })
            }
        }

        config.plugins.push(eePlugin)

        const ctx = await ESBuild.context(config);

        await ctx.watch()

        // if(this.type ==='server') {
        //     const from = path.join(import.meta.dirname, '..', '..', 'node_modules')
        //     const to = path.resolve(this.#resourcesDir, this.type, 'node_modules')
        //     console.log(from)
        //     console.log(to)
        //     try {fs.unlinkSync(to)} catch {}
        //     fs.symlinkSync(from, to)
        // }

        return ee;
    }

    #generateConfig() {

        const external = ['alt-server', 'alt-shared', 'alt-client', 'alt-shared', 'natives']

        const plugins = []

        if (this.type === 'server') {
            plugins.push(
                copy({
                    resolveFrom: 'out',
                    assets: [
                        {
                            from: ['config.toml'],
                            to: ['config.toml'],
                        },
                    ],
                }),
            )
        } else if (this.type === 'client') {
            plugins.push(copy({
                assets: [
                    {
                        from: ['src/client/html/**/*'],
                        to: ['html'],
                    },
                ],
            }))
            plugins.push({
                name: 'write-text-plugin',
                setup(build) {
                    build.onEnd(() => {
                        const workDir =  path.resolve(path.parse(build.initialOptions.outdir || build.initialOptions.outfile).dir)
                        const configPath = path.join(workDir, '..', '..', '..', '..', '..', 'config.toml')
                        const config = toml.parse(fs.readFileSync(configPath, 'utf8'))
                        fs.writeFileSync(path.join(workDir,'config.toml'), objToToml(config.client))
                        const content =  fs.readFileSync(build.initialOptions.outfile, 'utf8');
                        const configText = `globalThis.config = ${JSON.stringify(config.client)}`
                        fs.writeFileSync(build.initialOptions.outfile, configText+ '\n\n' + content)
                    });
                },
            })
        }

        const _ = {
            bundle: true,
            target: 'esnext',
            format: 'esm',
            entryPoints: [path.join(this.#srcDir, this.type, 'index.ts')],
            outfile: path.join(this.#resourcesDir, this.type, 'index' + '.js'),
            logLevel: 'info',
            sourcemap: true,
            minify: false,
            keepNames: true,
            plugins,
            external
        }

        if(this.type ==='server') {
            return {
                bundle: true,
                target:  ['esnext'],
                format: 'esm',
                entryPoints: [path.join(this.#srcDir, this.type, 'index.ts')],
                // outfile: path.join(this.#resourcesDir, this.type, 'index' + '.js'),
                outdir: path.join(this.#resourcesDir, this.type),
                logLevel: 'info',
                splitting: true,
                sourcemap: true,
                minify: false,
                keepNames: true,
                treeShaking: true,
                platform: 'node',
                plugins: [
                    ...plugins,
                    nodeExternalsPlugin(),
                ],
                tsconfig: path.resolve(this.#srcDir, this.type, 'tsconfig.json'),
                external: [
                    "alt-server",
                    "alt-shared",
                    "alt-client",
                    "natives",
                    "pg",
                    "pino",
                    "pino-loki",
                    "pino-pretty"
                ],
            }
            // _.bundle = false
            // _.platform = 'node'
            // delete _.outfile
            // _.outdir = path.join(this.#resourcesDir, this.type)
            // _.splitting =true
            // delete _.external
            // // _.external.push('pg', 'pino', 'pino-loki', 'pino-pretty')
            // console.log(JSON.stringify(_, null, 2))
        }

        return _
    }
}
