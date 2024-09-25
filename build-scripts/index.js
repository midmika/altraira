import path from "node:path";
import child_process from "node:child_process";
import fse from "fs-extra";
import {buildProduction} from "./strategy/prod.js";
import {serveStrategy} from "./dev.js";
import {configureAltVConfig} from "./altv-config.js";

let MODE = process.argv[2]
if(!MODE) {
    console.error(`'BUILD_MODE' is not specified`)
    process.exit(1);
}

process.stdout.write(`Build script mode: ${MODE}\n`)

const ROOT_DIR = path.join(import.meta.dirname, '..')
const SRC_DIR = path.join(ROOT_DIR, 'src')
const BIN_DIR = path.join(import.meta.dirname, '..', 'bin')
const RESOURCE_DIR = path.join(BIN_DIR, 'resources');
const CORE_RESOURCE_DIR = path.join(RESOURCE_DIR, 'core');

const downloadAltVPackages = async () => new Promise((resolve) => {
    const cp = child_process.exec('npx altv-pkg release', { cwd: BIN_DIR })
    cp.stdout.on('data', (data) => process.stdout.write(data))
    cp.on('exit', resolve)
})

export const index = async () => {

    console.clear()

    // only local
    fse.emptyDirSync(BIN_DIR)
    //
    fse.mkdirSync(RESOURCE_DIR)
    fse.mkdirSync(CORE_RESOURCE_DIR)

    // only local
    // fse.copySync(
    //     path.join(ROOT_DIR, '.altvpkgrc.json'),
    //     path.join(BIN_DIR, '.altvpkgrc.json'),
    // )
    // fse.copySync(
    //     path.join(ROOT_DIR, 'package.json'),
    //     path.join(BIN_DIR, 'package.json'),
    // )
    //

    // configureAltVConfig(BIN_DIR, CORE_RESOURCE_DIR)
    // await downloadAltVPackages()

    if(MODE === 'prod') {
        await buildProduction(ROOT_DIR, SRC_DIR, CORE_RESOURCE_DIR)
        console.log('Done.')
    } else {
        fse.copySync(
            path.join(ROOT_DIR, '.env'),
            path.join(CORE_RESOURCE_DIR, 'server', '.env')
        )
        await serveStrategy(ROOT_DIR, SRC_DIR, CORE_RESOURCE_DIR)
    }

}

void index()
