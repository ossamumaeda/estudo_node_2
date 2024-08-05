import fastify from 'fastify'
import {knexExport} from './database'
const app = fastify()
const __PORT__ = 3000
app.get('/', () => {
  const teste = knexExport('sqlite_schema').select('*')
  return teste
})

app
  .listen({
    port: __PORT__,
  })
  .then(() => {
    console.log('Server is Online !')
  })
