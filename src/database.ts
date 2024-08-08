// import { knex as setupKnex } from 'knex'
import { env } from './env';
import pkg, { Knex } from 'knex'
const { knex  } = pkg

export const config: Knex.Config = {
  client: 'sqlite',
  connection:{
    filename: env.DATABASE_URL ?? ''
  },
  useNullAsDefault:true,
  migrations:{
    extension: 'ts',
    directory: './tmp/migrations'
  }
};

export const knexExport = knex(config)
