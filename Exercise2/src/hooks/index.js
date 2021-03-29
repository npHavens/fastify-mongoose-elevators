const buildingController = require('../controllers/building.js')

exports.validateFloorRequest = async (request, reply) => {
  if (request.method === 'PATCH') {
    if (!request.query.status && !request.query.floor) {
      return reply.badRequest('Status or Floor param must be included')
    }

    if (request.query.status) {
        return elevatorController.updateElevatorStatus(request, reply)
    }

    if (request.query.floor) {
      const { floorCount } = await buildingController.getBuildingById(request, reply)

      if (request.query.floor < 1) {
        return reply.badRequest('Floor must be 1 or greater')
      }

      if (request.query.floor > floorCount) {
        return reply.badRequest(`Building ${ request.params.buildingId } only contains ${ floorCount } floors`)
      }
    }
  }
}
