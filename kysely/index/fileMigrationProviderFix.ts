// @ts-ignore
import { isFunction, isObject } from 'node:util';

export class FileMigrationProvider {
    #props;
    constructor(props) {
        this.#props = props;
    }
    async getMigrations() {
        const migrations = {};
        const files = await this.#props.fs.readdir(this.#props.migrationFolder);
        for (const fileName of files) {
            if (
                fileName.endsWith('.js') ||
                (fileName.endsWith('.ts') && !fileName.endsWith('.d.ts')) ||
                fileName.endsWith('.mjs') ||
                (fileName.endsWith('.mts') && !fileName.endsWith('.d.mts'))
            ) {
                let migration;
                // @ts-ignore
                if (process.platform === 'win32') {
                    migration = await import(
                        // @ts-ignore
                        new URL('file://' + this.#props.path.join(this.#props.migrationFolder, fileName))
                    );
                } else {
                    migration = await import(this.#props.path.join(this.#props.migrationFolder, fileName));
                }

                const migrationKey = fileName.substring(0, fileName.lastIndexOf('.'));
                // Handle esModuleInterop export's `default` prop...
                if (isMigration(migration?.default)) {
                    migrations[migrationKey] = migration.default;
                } else if (isMigration(migration)) {
                    migrations[migrationKey] = migration;
                }
            }
        }
        return migrations;
    }
}
function isMigration(obj) {
    return isObject(obj) && isFunction(obj.up);
}
