import { promises as fs } from 'node:fs';
import pg from 'pg';
import { Kysely, Migrator, PostgresDialect } from 'kysely';
import path from 'path';
import { FileMigrationProvider } from './fileMigrationProviderFix';
import {config, migrationsDir} from "./const";

async function migrateUp() {
    const db = new Kysely({
        dialect: new PostgresDialect({
            pool: new pg.Pool({
                host: config.host,
                port: config.port,
                user: config.user,
                password: config.password,
            }),
        }),
    });

    const migrator = new Migrator({
        db,
        provider: new FileMigrationProvider({
            fs,
            path,
            migrationFolder: migrationsDir,
        }),
    });

    const { error, results } = await migrator.migrateUp();

    results?.forEach((it) => {
        if (it.status === 'Success') {
            console.log(`migration "${it.migrationName}" was executed successfully`);
        } else if (it.status === 'Error') {
            console.error(`failed to execute migration "${it.migrationName}"`);
        }
    });

    if (error) {
        console.error('failed to migrate');
        console.error(error);
        process.exit(1);
    }

    await db.destroy();
}

async function migrateAll() {
    const db = new Kysely({
        dialect: new PostgresDialect({
            pool: new pg.Pool({
                host: config.host,
                port: config.port,
                user: config.user,
                password: config.password,
            }),
        }),
    });

    const migrator = new Migrator({
        db,
        provider: new FileMigrationProvider({
            fs,
            path,
            migrationFolder: migrationsDir,
        }),
    });

    const { error, results } = await migrator.migrateToLatest();

    results?.forEach((it) => {
        if (it.status === 'Success') {
            console.log(`migration "${it.migrationName}" was executed successfully`);
        } else if (it.status === 'Error') {
            console.error(`failed to execute migration "${it.migrationName}"`);
        }
    });

    if (error) {
        console.error('failed to migrate');
        console.error(error);
        process.exit(1);
    }

    await db.destroy();
}

async function migrateDown() {
    const db = new Kysely({
        dialect: new PostgresDialect({
            pool: new pg.Pool({
                host: config.host,
                port: config.port,
                user: config.user,
                password: config.password,
            }),
        }),
    });

    console.log('migrationsDir', migrationsDir);

    const migrator = new Migrator({
        db,
        provider: new FileMigrationProvider({
            fs,
            path,
            migrationFolder: migrationsDir,
        }),
    });

    const { error, results } = await migrator.migrateDown();

    results?.forEach((it) => {
        if (it.status === 'Success') {
            console.log(`migration "${it.migrationName}" was executed successfully`);
        } else if (it.status === 'Error') {
            console.error(`failed to execute migration "${it.migrationName}"`);
        }
    });

    if (error) {
        console.error('failed to migrate');
        console.error(error);
        process.exit(1);
    }

    await db.destroy();
}

const opt = process.argv[2];

if (opt === 'up') {
    void migrateUp();
} else if (opt === 'down') {
    void migrateDown();
} else if (opt === 'all') {
    void migrateAll();
}
