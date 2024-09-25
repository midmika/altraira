import type {DB} from "kysely-codegen";
import type { Kysely } from 'kysely';
import { sql } from 'kysely'

export async function up(db: Kysely<DB>): Promise<void> {

    await sql
        `
        CREATE OR REPLACE FUNCTION update_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
        NEW.updated_at = now();
        RETURN NEW;
        END;
        $$ language 'plpgsql';
        `
        .execute(db)

}

export async function down(db: Kysely<DB>): Promise<void> {
    await sql
        `
        drop function if exists update_updated_at
        `
        .execute(db)
}