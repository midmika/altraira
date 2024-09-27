import path from "node:path";
import ESBuild from "esbuild";
import { build as ViteBuild } from 'vite';
import {getClientConfig, getServerConfig} from "./build.config.js";
import fse from "fs-extra";

const ROOT_DIR = path.join(import.meta.dirname, '..')
const SRC_DIR = path.join(ROOT_DIR, 'src')
const OUT_DIR = path.join(ROOT_DIR, 'dist')

const RESOURCES_DIR = path.join(OUT_DIR, 'resources');
const CORE_RESOURCE_DIR = path.join(RESOURCES_DIR, 'core');
const SERVER_CORE_RESOURCE_DIR = path.join(CORE_RESOURCE_DIR, 'server');

const writeOptimizedServerPackageJson = (ROOT_DIR, externalDeps) => {
    const currentPackageJson = JSON.parse(fse.readFileSync(
        path.join(ROOT_DIR, 'package.json'),
        'utf8'
    ))

    const currentDeps = currentPackageJson.dependencies

    const newDeps = {}

    { // kysely kostyl`
        const dotenv = Object.entries(currentDeps).find(i => i[0] === 'dotenv' && i[1])
        if(dotenv) newDeps['dotenv'] = dotenv[1]
    }

    Object.entries(currentDeps).forEach(_ => {
        if (externalDeps.has(_[0])) {
            newDeps[_[0]] = _[1]
        }
    })

    const optimizedPackageJson = {
        ...currentPackageJson,
        dependencies: newDeps,
        devDependencies: {},
        scripts: {}
    }

    fse.writeFileSync(
        path.join(SERVER_CORE_RESOURCE_DIR, 'package.json'),
        JSON.stringify(optimizedPackageJson, null, 2)
    )
}

const buildServer = async (ROOT_DIR, srcDir, outDir) => {
    const config = getServerConfig(ROOT_DIR, srcDir, outDir, 'production');
    const res = await ESBuild.build(config)
    const firstError = res.errors[0]
    if(firstError) {
        console.log('Fatal client build')
        throw firstError
    }

    const externalDeps = new Set()
    Object
        .entries(res?.metafile?.inputs)
        .forEach(i => i[1]?.imports?.forEach(i => {if (i?.external) externalDeps.add(i.path)}))
    writeOptimizedServerPackageJson(ROOT_DIR, externalDeps)
}

const buildClient = async (ROOT_DIR, srcDir, outDir) => {
    const config = getClientConfig(ROOT_DIR, srcDir, outDir, 'production');
    const res = await ESBuild.build(config)
    const firstError = res.errors[0]
    if(firstError) {
        console.log('Fatal client build')
        throw firstError
    }
}

const buildWeb = async (ROOT_DIR, srcDir, outDir) => {
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

const buildProduction = async (ROOT_DIR, srcDir, coreResourceDir) => {
    try {
        await Promise.all([
            buildServer(ROOT_DIR, path.join(srcDir, 'server'), path.join(coreResourceDir, 'server')),
            buildClient(ROOT_DIR, path.join(srcDir, 'client'), path.join(coreResourceDir, 'client')),
            buildWeb(ROOT_DIR, path.join(srcDir, 'web'), path.join(coreResourceDir, 'client', 'web')),
        ])
    } catch (error) {
        console.log('Fatal error')
        console.log(error)
        process.exit(1)
    }
}

const index = async () => {
    fse.emptyDirSync(OUT_DIR)
    fse.mkdirSync(RESOURCES_DIR)
    fse.mkdirSync(CORE_RESOURCE_DIR)
    fse.mkdirSync(SERVER_CORE_RESOURCE_DIR)

    let serverToml = path.join(ROOT_DIR, 'altv', 'server.toml')

    fse.copySync(
        path.join(serverToml),
        path.join(OUT_DIR, 'server.toml'),
    )

    fse.copySync(
        path.join(ROOT_DIR, 'altv', 'resource.toml'),
        path.join(CORE_RESOURCE_DIR, 'resource.toml'),
    )

    await buildProduction(ROOT_DIR, SRC_DIR, CORE_RESOURCE_DIR)

    fse.copySync(
        path.join(ROOT_DIR, 'kysely'),
        path.join(SERVER_CORE_RESOURCE_DIR, 'kysely'),
    )
}

void index()