import type {CreateTableBuilder} from "kysely/dist/cjs/schema/create-table-builder";
import {sql} from "kysely";

export const kyselyUseTimestamp = <T extends string, K extends string>(builder: CreateTableBuilder<T, K>): CreateTableBuilder<T, K> => {
    builder.addColumn('created_at', 'date', (col) =>
        col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    builder.addColumn('updated_at', 'date', (col) =>
        col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    return builder
}