import {nodeExternalsPlugin} from "esbuild-node-externals";
import path from "node:path";
import {generateClientConfig} from "./tools/prepareClientConfig.js";
import fse from "fs-extra";

export const getServerConfig = (rootDir, srcDir, outDir, mode) => {
    const plugins = [nodeExternalsPlugin({ packagePath: path.join(rootDir, 'package.json') })]

    return {
        bundle: true,
        target:  ['esnext'],
        format: 'esm',
        entryPoints: [path.join(srcDir, 'index.ts')],
        outdir: outDir,
        logLevel: 'info',
        splitting: true,
        sourcemap: mode === 'development',
        minify: mode === 'production',
        keepNames: mode === 'development',
        treeShaking: true,
        platform: 'node',
        metafile: true,
        plugins,
        external: [
            "alt-server",
            "alt-shared",
        ],
    }
}

export const getClientConfig = (rootDir, srcDir, outDir, mode) => {
    const plugins = [
        {
            name: 'write-text-plugin',
            setup(build) {
                build.onEnd(() => {
                    const content =  fse.readFileSync(build.initialOptions.outfile, 'utf8');
                    const configText = `globalThis.config = ${JSON.stringify(generateClientConfig(mode))}`
                    fse.writeFileSync(build.initialOptions.outfile, configText + '\n\n' + content)
                });
            },
        }
    ]

    return {
        bundle: true,
        target: 'esnext',
        format: 'esm',
        entryPoints: [path.join(srcDir, 'index.ts')],
        outfile: path.join(outDir, 'index' + '.js'),
        logLevel: 'info',
        sourcemap: mode === 'development',
        minify: mode === 'production',
        keepNames: mode === 'development',
        plugins,
        external: ['alt-client', 'alt-shared', 'natives']
    }
}