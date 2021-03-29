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
