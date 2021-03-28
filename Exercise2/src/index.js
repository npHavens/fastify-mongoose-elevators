const fastify = require('fastify')({
  logger: true
})
const mongoose = require('mongoose')

const routes = require('./routes')


// Connect to DB
mongoose.connect('mongodb://virbela_node_client:32agrt56sg@localhost:27017/virbela', {useNewUrlParser: true, useUnifiedTopology: true })
 .then(() => console.log('MongoDB connected…'))
 .catch(err => console.log(err))

 fastify.register(require('fastify-sensible'))

routes.forEach((route) => {
  fastify.route(route)
})

fastify.listen(3000, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})
