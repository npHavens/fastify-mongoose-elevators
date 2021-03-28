const elevatorController = require('../controllers/elevator.js')
const buildingController = require('../controllers/building.js')


const routes = [
  /** ELEVATOR ROUTES */
  {
    method: 'POST',
    url: '/api/buildings/:buildingId/elevators',
    // schema: { body: { type: 'string' }},
    handler: elevatorController.addElevator
  },
  {
    method: 'GET',
    url: '/api/elevators',
    // schema: { body: { type: 'string' }},
    handler: elevatorController.getElevators
  },
  {
    method: 'GET',
    url: '/api/buildings/:buildingId/elevators/:elevatorId',
    // schema: { body: { type: 'string' }},
    handler: elevatorController.getElevatorById
  },
  {
    method: 'PATCH',
    url: '/api/buildings/:buildingId/elevators/:elevatorId',
    // schema: { body: { type: 'string' }},
    handler: async (request, reply) => {
      if (!request.query.status && !request.query.floor) {
        return reply.badRequest('Status or Floor param must be included')
      }

      if (request.query.status) {
        return elevatorController.updateElevatorStatus(request, reply)
      }

      if (request.query.floor) {
        const { floorCount } = await buildingController.getBuildingById(request, reply)

        if (request.query.floor < 1) {
          reply.badRequest('Floor must be 1 or greater')
        }

        if (request.query.floor > floorCount) {
          reply.badRequest(`Building ${ request.params.buildingId } only contains ${ floorCount } floors`)
        }
        return elevatorController.goToFloor(request, reply)
      }
    }
  },
  /** BUILDING ROUTES */
  {
    method: 'POST',
    url: '/api/buildings',
    // schema: { body: { type: 'string' }},
    handler: buildingController.addBuilding
  },
  {
    method: 'GET',
    url: '/api/buildings',
    // schema: { body: { type: 'string' }},
    handler: buildingController.getBuildings
  },
  {
    method: 'GET',
    url: '/api/buildings/:buildingId',
    // schema: { body: { type: 'string' }},
    handler: async (request, reply) => {

      const buildingData = await buildingController.getBuildingById(request, reply)
      const elevators = await elevatorController.getElevatorsByBuildingId(buildingData._id)

      console.log("GET BUILDING", buildingData)
      buildingData.elevators = elevators

      return reply.send({
        buildingData: {
          _id: buildingData._id,
          floorCount: buildingData.floorCount,
          elevators
        }
      })
    },
  },
]

module.exports = routes
