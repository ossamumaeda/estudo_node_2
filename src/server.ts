import fastify from 'fastify'
import cookie from '@fastify/cookie'

import {knexExport} from './database'
import crypto, { randomUUID } from 'node:crypto'
import { env } from './env'
import { transactionRoutes } from './routes/transactions'
const app = fastify()

app.register(cookie)

app.register(transactionRoutes,{
  prefix:'transactions',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('Server is Online !')
  })
