import * as path from 'path';
import fs from 'fs';
import {migrationsDir} from "./const";

// @ts-ignore
const argName = process.argv[2];
if (!argName || !argName.trim()) {
    console.error('Migration name doesnt specified');
    // @ts-ignore
    process.exit(1);
}

const name = argName.replaceAll(' ', '_');

const baseFileContent = `import type {DB} from "kysely-codegen";
import type { Kysely } from 'kysely';
import { sql } from 'kysely'

export async function up(db: Kysely<DB>): Promise<void> {
    
}

export async function down(db: Kysely<DB>): Promise<void> {
    
}`;

const fileName = Date.now() + '-' + name + '.ts';

fs.writeFileSync(path.join(migrationsDir, fileName), baseFileContent);

console.log(fileName, 'created');
