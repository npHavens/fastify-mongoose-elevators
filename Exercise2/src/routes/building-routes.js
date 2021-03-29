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

const BuildingSchema = { 
    type: 'object',
    properties: {
        _id: { type: 'number' },
        floorCount: { type: 'number' },
        __v: { type: 'number' }
    }
  }

exports.buildingRoutes = [
      {
        method: 'POST',
        url: '/api/buildings/:buildingId/go',
        schema: {
            params: {
                type: 'object',
                properties: {
                    buildingId: { type: 'number' }
                }
            },
            response: {
                200: {
                    type: 'string'
                }
            }
        },
        handler: elevatorController.goToQueuedFloors
      },
    {
        method: 'POST',
        url: '/api/buildings',
        schema: {
            body: {
                type: 'object',
                required: ['_id', 'floorCount'],
                properties: {
                    _id: { type: 'number' },
                    floorCount: { type: 'number' }
                }
            },
            response: {
                200: BuildingSchema
            }
         },
        handler: buildingController.addBuilding
      },
      {
        method: 'GET',
        url: '/api/buildings',
        schema: {
            response: {
                200: {
                    type: 'array',
                    items: BuildingSchema
                }
            }
         },
        handler: buildingController.getBuildings
      },
      {
        method: 'GET',
        url: '/api/buildings/:buildingId',
        schema: {
            params: {
                type: 'object',
                properties: {
                    buildingId: { type: 'number' }
                }
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        _id: { type: 'number' },
                        floorCount: { type: 'number' },
                        elevators:  { type: 'array' }
                    }
                }
            }
        },
        handler: getAllElevatorsForBuilding
      },
]
