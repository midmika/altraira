import fse from "fs-extra";
import path from "node:path";
import {downloadAltVPackages} from "./tools.dev.js";

const ROOT_DIR = path.join(import.meta.dirname, '..')
const BIN_DIR = path.join(import.meta.dirname, '..', 'bin')
const RESOURCES_DIR = path.join(BIN_DIR, 'resources');
const CORE_RESOURCE_DIR = path.join(RESOURCES_DIR, 'core');
const SERVER_CORE_RESOURCE_DIR = path.join(CORE_RESOURCE_DIR, 'server');

const index = async () => {
    fse.emptyDirSync(BIN_DIR)
    fse.mkdirSync(RESOURCES_DIR)
    fse.mkdirSync(CORE_RESOURCE_DIR)

    fse.copyFileSync(
        path.join(ROOT_DIR, '.altvpkgrc.json'),
        path.join(BIN_DIR, '.altvpkgrc.json'),
    )

    fse.copySync(
        path.join(ROOT_DIR, 'altv', 'server.dev.toml'),
        path.join(BIN_DIR, 'server.toml'),
    )

    fse.copySync(
        path.join(ROOT_DIR, 'altv', 'resource.toml'),
        path.join(CORE_RESOURCE_DIR, 'resource.toml'),
    )

    fse.copySync(
        path.join(ROOT_DIR, 'altv', 'resource.toml'),
        path.join(SERVER_CORE_RESOURCE_DIR, 'resource.toml'),
    )

    await downloadAltVPackages(BIN_DIR)
}

void index()