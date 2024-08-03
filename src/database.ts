// import { knex as setupKnex } from 'knex'
import pkg, { Knex } from 'knex'
const { knex  } = pkg

export const config: Knex.Config = {
  client: 'sqlite',
  connection:{
    filename:'./tmp/app.db'
  },
  useNullAsDefault:true,
  migrations:{
    extension: 'ts',
    directory: './tmp/migrations'
  }
};

export const knexExport = knex(config)
