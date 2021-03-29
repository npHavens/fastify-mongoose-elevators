const elevatorController = require('../controllers/elevator.js')

exports.elevatorRoutes = [
    {
        method: 'GET',
        url: '/api/elevators',
        handler: elevatorController.getElevators
     },
     {  
         method: 'POST',
         url: '/api/buildings/:buildingId/elevators',
         // Example of Request/Response Scheme generated in Swagger
         schema: {
            params: {
                type: 'object',
                properties: {
                    buildingId: { type: 'string' }
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
                200: {
                    type: 'object',
                    properties: {
                        "currentFloor": { type: 'string' },
                        "floorsToVisit": { type: 'array' },
                        "_id": { type: 'string' },
                        "buildingId": { type: 'number' },
                        "__v": { type: 'number' }
                    }
                }
            }
         },
         handler: elevatorController.addElevator
     },
     {
         method: 'GET',
         url: '/api/buildings/:buildingId/elevators/:elevatorId',
         handler: elevatorController.getElevatorById
     },
     {
         method: 'PATCH',
         url: '/api/buildings/:buildingId/elevators/:elevatorId',
         handler: elevatorController.queueFloor
     }
]
