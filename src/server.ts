import fastify from 'fastify'

const app = fastify()
const __PORT__ = 3000
app.get('/', () => {
  return 'Ola mundo'
})

app
  .listen({
    port: __PORT__,
  })
  .then(() => {
    console.log('Server is Online !')
  })
