import fse from "fs-extra";
import {objToToml} from "./tools/objToToml.js";
import path from "node:path";

const baseConfig = {
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

export const configureAltVConfig = (binDir, resourceDir) => {
    const config = new Object(baseConfig);

    if(process.env.ALTAIRA_MODE === 'dev') {
        config.debug = true
    }

    fse.writeFileSync(
        path.join(binDir, 'server.toml'),
        objToToml(config)
    )

    fse.writeFileSync(
        path.join(resourceDir, 'resource.toml'),
        objToToml(rootResourceConfig)
    )
}