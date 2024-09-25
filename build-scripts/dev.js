import path from "node:path";
import ESBuild from "esbuild";
import {build as ViteBuild} from 'vite';
import {getClientConfig, getServerConfig} from "./build.config.js";
import fse from "fs-extra";

const ROOT_DIR = path.join(import.meta.dirname, '..')
const SRC_DIR = path.join(ROOT_DIR, 'src')
const BIN_DIR = path.join(import.meta.dirname, '..', 'bin')
const RESOURCE_DIR = path.join(BIN_DIR, 'resources');
const CORE_RESOURCE_DIR = path.join(RESOURCE_DIR, 'core');

const writeOptimizedServerPackageJson = (rootDir, externalDeps) => {
    const currentPackageJson = JSON.parse(fse.readFileSync(
        path.join(ROOT_DIR, 'package.json'),
        'utf8'
    ))

    const currentDeps = currentPackageJson.dependencies

    const newDeps = {}
    Object.entries(currentDeps).forEach(_ => {
        if (externalDeps.has(_[0])) {
            newDeps[_[0]] = _[1]
        }
    })

    const optimizedPackageJson = {
        ...currentPackageJson,
        dependencies: newDeps,
        devDependencies: {}
    }

    // fse.writeFileSync(path.join(ROOT_DIR, 'server.package.json'), JSON.stringify(optimizedPackageJson, null, 2))
}

const buildServer = async (rootDir, srcDir, outDir) => {
    const config = getServerConfig(rootDir, srcDir, outDir, 'dev');
    const res = await ESBuild.build(config)

    const externalDeps = new Set()
    Object
        .entries(res.metafile.inputs)
        .forEach(i => i[1]?.imports.forEach(i => {if (i?.external) {
            externalDeps.add(i.path)
            console.log(i)
        }}))
    writeOptimizedServerPackageJson(rootDir, externalDeps)

    const firstError = res.errors[0]
    if (firstError) {
        console.log('Fatal client build')
        throw firstError
    }
}

const buildClient = async (rootDir, srcDir, outDir) => {
    const config = getClientConfig(rootDir, srcDir, outDir, 'dev');
    const res = await ESBuild.build(config)
    const firstError = res.errors[0]
    if (firstError) {
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

const buildProduction = async (rootDir, srcDir, coreResourceDir) => {
    try {
        await Promise.all([
            buildServer(rootDir, path.join(srcDir, 'server'), path.join(coreResourceDir, 'server')),
            // buildClient(rootDir, path.join(srcDir, 'client'), path.join(coreResourceDir, 'client')),
            // buildWeb(rootDir, path.join(srcDir, 'web'), path.join(coreResourceDir, 'client', 'web')),
        ])
    } catch (error) {
        console.log('Fatal error')
        console.log(error)
        process.exit(1)
    }
}

void buildProduction(ROOT_DIR, SRC_DIR, CORE_RESOURCE_DIR)