const Elevator = require('../models/Elevator.js')

exports.addElevator = async (request, reply) => {
    try {
      const elevator = new Elevator(request.body)
      return elevator.save()
    } catch (err) {
        console.log('ERRRORR', err)
      //throw boom.boomify(err)
    }
}

exports.getElevators = async (request, reply) => {
    try {
        //console.log('REQ', request.body.buildingId)
      return Elevator.find()
    } catch (err) {
        console.log('ERRRORR', err)
      //throw boom.boomify(err)
    }
}
exports.getElevatorById = async (request, reply) => {
  try {
    console.log('GETTING EL BY ID', request.params.elevatorId)
    return Elevator.findById(request.params.elevatorId)
  } catch (err) {
      console.log('ERRRORR', err)
    //throw boom.boomify(err)
  }
}

exports.updateElevatorStatus = async (request, reply) => {
  try {
      //const { isDoorOpen } = Elevator.findById(request.params.elevatorId)
      console.log('TOGGLING', request.params.elevatorId, request.query)
    return Elevator.findByIdAndUpdate(request.params.elevatorId, {
      status: request.query.status,
    }, { new: true })
  } catch (err) {
      console.log('ERRRORR', err)
    //throw boom.boomify(err)
  }
}

exports.goToFloor = async (request, reply) => {
  try {
    const elevatorData = await Elevator.findByIdAndUpdate(request.params.elevatorId, {
      currentFloor: request.query.floor,
      status: 'open'
    }, { new: true })

    console.log(`Elevator ${ request.params.elevatorId } in building ${ request.params.buildingId } is now on floor ${ elevatorData.currentFloor } with door ${ elevatorData.status }`)
    return Promise.resolve(elevatorData)
  } catch (err) {
      console.log('ERRRORR', err)
    //throw boom.boomify(err)
  }
}

// exports.goToFloor = async (request, reply) => {
//   try {
//       //const { isDoorOpen } = Elevator.findById(request.params.elevatorId)
//       console.log('TOGGLING', request.params.elevatorId, request.query)
//     return Elevator.findByIdAndUpdate(request.params.elevatorId, {
//       currentFloor: request.query.floor
//     }, { new: true })
//   } catch (err) {
//       console.log('ERRRORR', err)
//     //throw boom.boomify(err)
//   }
// }

exports.getElevatorsByBuildingId = async (buildingId) => {
  try {
      console.log('GETTING ELEVSATORS', buildingId)
    return Elevator.find({ buildingId })
  } catch (err) {
      console.log('ERRRORR', err)
    //throw boom.boomify(err)
  }
}

