import { Kysely, PostgresDialect } from 'kysely';
import type { DB } from 'kysely-codegen';
import pg from 'pg';

export type IKysely = Kysely<DB>;

export const KyselyPostgresConnector = (): IKysely => {
    return new Kysely<DB>({
        dialect: new PostgresDialect({
            pool: new pg.Pool({
                host: process.env.POSTGRES_HOST,
                port: Number(process.env.POSTGRES_PORT),
                user: process.env.POSTGRES_USER,
                password: process.env.POSTGRES_PASS,
            }),
        }),
    });
};
