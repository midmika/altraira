import type {DB} from "kysely-codegen";
import type { Kysely } from 'kysely';
import { sql } from 'kysely'
import {kyselyUseTimestamp} from "../helpers/useTimestamp";

export async function up(db: Kysely<DB>): Promise<void> {
    await db.schema.createTable('accounts')
        .addColumn('id', 'int4', (col) => col.generatedAlwaysAsIdentity().primaryKey())
        .addColumn('social_id', 'varchar(60)', (col) => col.notNull())
        .addColumn('social_name', 'varchar(60)', (col) => col.notNull())
        .$call(kyselyUseTimestamp)
        .execute()

    await db.schema.createIndex('idx_accounts_id').on('accounts').column('id').unique().execute()

    await sql`create trigger update_modified_time BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE PROCEDURE update_updated_at();`.execute(db)
}

export async function down(db: Kysely<DB>): Promise<void> {
    await db.schema.dropTable('accounts').ifExists().execute()
}