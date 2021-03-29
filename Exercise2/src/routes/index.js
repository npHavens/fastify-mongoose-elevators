const { buildingRoutes } = require('./building-routes')
const { elevatorRoutes } = require('./elevator-routes')

const routes = [
  ...buildingRoutes,
  ...elevatorRoutes
]

module.exports = routes
