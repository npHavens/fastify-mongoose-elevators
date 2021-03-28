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
      //console.log('TOGGLING', request.params.elevatorId, request.query)
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
    const elevatorDoc = await Elevator.findById(request.params.elevatorId)

    if (!elevatorDoc.floorsToVisit.includes(request.query.floor) && Number(request.query.floor) !== elevatorDoc.currentFloor) {
      const updated = [...elevatorDoc.floorsToVisit, Number(request.query.floor), elevatorDoc.currentFloor]

      console.log(`Elevator ${ request.params.elevatorId } in building ${ request.params.buildingId } is now on floor ${ elevatorDoc.currentFloor } with door ${ elevatorDoc.status }`)

     const sorted = updated.sort((a, b) => {
       return a - b
     })

     let currentFloorIndex = sorted.indexOf(elevatorDoc.currentFloor)

     const lowerDiff = sorted[currentFloorIndex] - sorted[currentFloorIndex - 1]
     const upperDiff = (sorted[currentFloorIndex + 1] || sorted[currentFloorIndex]) - sorted[currentFloorIndex]

    let nextFloorIndex, queue, lastFloors

    if (upperDiff <= lowerDiff) {

      nextFloorIndex = sorted[currentFloorIndex + 1]

      lastFloors = sorted.slice(0, currentFloorIndex).sort((a, b) => b - a)

      queue = sorted.slice(currentFloorIndex).concat(lastFloors)
    } else {

      nextFloorIndex = sorted[currentFloorIndex - 1]

      lastFloors = sorted.slice(currentFloorIndex + 1)
       queue = sorted.slice(0, currentFloorIndex + 1).sort(((a, b) => {
        return b - a
      })).concat(lastFloors)
    }

     elevatorDoc.floorsToVisit = queue.filter((item) => {
       return item !== elevatorDoc.currentFloor
     })

     const updatedDoc = await elevatorDoc.save({ new: true })

      return Promise.resolve(updatedDoc)
 
    } else {
      return reply.conflict(`Floor ${ request.query.floor } is already in queue or is current floor`)
    }

  } catch (err) {
      console.log('ERRRORR', err)
    //throw boom.boomify(err)
  }
}

exports.goToQueuedFloors = async (request, reply) => {
  const elevatorDocs = await Elevator.find({ buildingId: request.params.buildingId })
  let count = 0

  for (const item of elevatorDocs) {
    for (const targetFloor of item.floorsToVisit) {
      await goToFloor(request.params.buildingId, item._id, targetFloor)
      count++
    }
  }

  reply.send(`${ count } queued actions executed`)
}

const goToFloor = async (builingId, elevatorId, targetFloor) => {
  const updated = await Elevator.findByIdAndUpdate(elevatorId, {
    currentFloor: targetFloor,
    status: 'open'
  })

  console.log(`Elevator ${ elevatorId } in building ${ builingId } going from floor ${ updated.currentFloor } to ${ targetFloor }`)
  console.log(`Elevator ${ elevatorId } in building ${ builingId } Door open`)

  await Elevator.findByIdAndUpdate(elevatorId, {
    floorsToVisit: updated.floorsToVisit.slice(1),
    status: 'closed'
  }, { new: true })

  console.log(`Elevator ${ elevatorId } in building ${ builingId } Door closed`)
}

exports.getElevatorsByBuildingId = async (buildingId) => {
  try {
    return Elevator.find({ buildingId })
  } catch (err) {
      console.log('ERRRORR', err)
    //throw boom.boomify(err)
  }
}

