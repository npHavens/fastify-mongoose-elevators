const fastify = require('fastify')({
  logger: true
})
const mongoose = require('mongoose')
const routes = require('./routes')
const { validateFloorRequest } = require('./hooks')

// Connect to DB
mongoose.connect('mongodb://virbela_node_client:32agrt56sg@localhost:27017/virbela', {useNewUrlParser: true, useUnifiedTopology: true })
 .then(() => console.log('MongoDB connected…'))
 .catch(err => console.log(err))

// Register Plugins
fastify.register(require('fastify-url-data'))
fastify.register(require('fastify-sensible'))
fastify.register(require('fastify-swagger'), {
  exposeRoute: true
})

// Register Hooks
fastify.addHook('preHandler', validateFloorRequest)

// Initialize Routes
routes.forEach((route) => {
  fastify.route(route)
})

// Start Server
fastify.listen(3000,(err, address) =>  {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})
