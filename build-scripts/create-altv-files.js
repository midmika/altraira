import path from "node:path";
import fse from "fs-extra";
import {objToToml} from "./tools/objToToml.js";


const config = {
    announce: false,
    description: 'Awesome server... I guess',
    website: 'test.com',
    gamemode: 'Death Match',
    language: 'ru',
    modules: ['js-module'],
    name: 'Altaira Death Match',
    players: 1048,
    tags: [],
    resources: ['core'],
    debug: false,
    host: '0.0.0.0',
    port: 7788,
    'js-module': {
        'global-webcrypto': true,
        'global-fetch': true,
        'source-maps': true,
        'network-imports': true,
        'extra-cli-args': ['--max-old-space-size=8192']
    },
    // worldProfiler: {
    //     port: 7797,
    //     host: '0.0.0.0'
    // }
}

const rootResourceConfig = {
    type: 'js',
    main: 'server/index.js',
    "client-files": ['client/*'],
    "client-main": 'client/index.js',
    deps: []
}

const ROOT_DIR = path.join(import.meta.dirname, '..')
const SRC_DIR = path.join(ROOT_DIR, 'src')
const BIN_DIR = path.join(import.meta.dirname, '..', 'bin')
const RESOURCE_DIR = path.join(BIN_DIR, 'resources');
const CORE_RESOURCE_DIR = path.join(RESOURCE_DIR, 'core');

fse.mkdirSync(RESOURCE_DIR)
fse.mkdirSync(CORE_RESOURCE_DIR)

if(process.env.ALTAIRA_MODE === 'dev') {
    config.debug = true
}

fse.writeFileSync(
    path.join(BIN_DIR, 'server.toml'),
    objToToml(config)
)

fse.writeFileSync(
    path.join(RESOURCE_DIR, 'resource.toml'),
    objToToml(rootResourceConfig)
)