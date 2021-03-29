const elevatorController = require('../controllers/elevator.js')
const buildingController = require('../controllers/building.js')

const getAllElevatorsForBuilding = async (request, reply) => {
    const buildingData = await buildingController.getBuildingById(request, reply)
    const elevators = await elevatorController.getElevatorsByBuildingId(buildingData._id)

    return reply.send({
      buildingData: {
        _id: buildingData._id,
        floorCount: buildingData.floorCount,
        elevators
      }
    })
}

exports.buildingRoutes = [
      {
        method: 'POST',
        url: '/api/buildings/:buildingId/go',
        handler: elevatorController.goToQueuedFloors
      },
    {
        method: 'POST',
        url: '/api/buildings',
        handler: buildingController.addBuilding
      },
      {
        method: 'GET',
        url: '/api/buildings',
        handler: buildingController.getBuildings
      },
      {
        method: 'GET',
        url: '/api/buildings/:buildingId',
        handler: getAllElevatorsForBuilding
      },
]
