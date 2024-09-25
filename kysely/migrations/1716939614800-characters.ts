import type { DB } from 'kysely-codegen';
import type { Kysely } from 'kysely';
import { sql } from 'kysely';
import { kyselyUseTimestamp } from '../helpers/useTimestamp';

export async function up(db: Kysely<DB>): Promise<void> {
    await db.schema
        .createTable('characters')
        .addColumn('id', 'int4', (col) => col.generatedAlwaysAsIdentity().primaryKey())
        .addColumn('account_id', 'int4', (col) => col.notNull().references('accounts.id'))
        .addColumn('username', 'varchar(28)', (col) => col.unique().notNull())
        .addColumn('dollars', 'int4', (col) => col.notNull().defaultTo(0))
        .addColumn('faction', 'varchar(20)', (col) => col.notNull())
        .addColumn('customization', 'text', (col) => col.notNull())
        .$call(kyselyUseTimestamp)
        .execute();

    await db.schema.createIndex('characters_idx').on('characters').column('id').unique().execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
    await db.schema.dropTable('characters').ifExists().execute();
}
