import createKnex, { Knex } from "knex";
import { env } from './env'

export const config: Knex.Config = {
    client: 'sqlite',
    connection: {
        filename: env.DATABASE_URL ?? ''
    },
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: './tmp/migrations'
    }
}

export const knexExport = createKnex(config)