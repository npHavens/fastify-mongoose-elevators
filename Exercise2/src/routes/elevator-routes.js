const elevatorController = require('../controllers/elevator.js')
const { ElevatorSchema } = require('../schemas')


exports.elevatorRoutes = [
    {
        method: 'GET',
        url: '/api/elevators',
        schema: {
            response: { 200: {
                type: 'array',
                items: ElevatorSchema
            } }
        },
        handler: elevatorController.getElevators
     },
     {
         method: 'POST',
         url: '/api/buildings/:buildingId/elevators',
         schema: {
            params: {
                type: 'object',
                properties: {
                    buildingId: { type: 'number' }
                }
            },
            body: {
                type: 'object',
                required: ['_id'],
                properties: {
                    _id: { type: 'string' }
                }
            },
            response: {
                200: ElevatorSchema
            }
         },
         handler: elevatorController.addElevator
     },
     {
         method: 'GET',
         url: '/api/buildings/:buildingId/elevators/:elevatorId',
         schema: {
            params: {
                type: 'object',
                properties: {
                    buildingId: { type: 'number' },
                    elevatorId: { type: 'string' }
                }
            },
            response: {
                200: ElevatorSchema
            }
        },
         handler: elevatorController.getElevatorById
     },
     {
         method: 'PATCH',
         url: '/api/buildings/:buildingId/elevators/:elevatorId',
         schema: {
            params: {
                type: 'object',
                properties: {
                    buildingId: { type: 'number' },
                    elevatorId: { type: 'string' }
                }
            },
            querystring: {
                type: 'object',
                properties: {
                    floor: { type: 'number' }
                }
            },
            response: {
                200: ElevatorSchema
            }
        },
         handler: elevatorController.queueFloor
     }
]
