const Elevator = require('../models/Elevator.js')

exports.addElevator = async (request, reply) => {
  try {
    const elevator = new Elevator({
      _id: request.body._id,
      buildingId: request.params.buildingId
    })

    return elevator.save()
  } catch (err) {
    return reply.internalServerError(err)
  }
}

exports.getElevators = async (request, reply) => {
  try {
    return Elevator.find()
  } catch (err) {
    return reply.internalServerError(err)
  }
}

exports.getElevatorById = async (request, reply) => {
  try {
    return Elevator.findById(request.params.elevatorId)
  } catch (err) {
    return reply.internalServerError(err)
  }
}

exports.updateElevatorStatus = async (request, reply) => {
  try {
    return Elevator.findByIdAndUpdate(request.params.elevatorId, {
      status: request.query.status,
    }, { new: true })
  } catch (err) {
    return reply.internalServerError(err)
  }
}

exports.getElevatorsByBuildingId = async (buildingId) => {
  try {
    return Elevator.find({ buildingId })
  } catch (err) {
    reply.internalServerError(err)
  }
}

exports.queueFloor = async (request, reply) => {
  const { params, query } = request
  try {
    const elevatorDoc = await Elevator.findById(params.elevatorId)
    const isValidFloorRequest = !elevatorDoc.floorsToVisit.includes(query.floor) && Number(query.floor) !== elevatorDoc.currentFloor

    if (isValidFloorRequest) {
      const updatedFloors = [
        ...elevatorDoc.floorsToVisit,
        Number(query.floor),
        // Temporarily add current floor to queue to sort and find the next closest floor
        elevatorDoc.currentFloor
      ]

      const sortedFloors = updatedFloors.sort((a, b) => a - b)
      let currentFloorIndex = sortedFloors.indexOf(elevatorDoc.currentFloor)

      // Check if a lower or higher floor is closer while handling the edge case of no higher floors existing
      const lowerDiff = sortedFloors[currentFloorIndex] - sortedFloors[currentFloorIndex - 1]
      const upperDiff = (sortedFloors[currentFloorIndex + 1] || sortedFloors[currentFloorIndex]) - sortedFloors[currentFloorIndex]

      let nextFloorIndex, queue, remainingFloors

      // Reorder the floor queue based on whether a higher or lower floor is closest
      if (upperDiff <= lowerDiff) {
        nextFloorIndex = sortedFloors[currentFloorIndex + 1]
        remainingFloors = sortedFloors.slice(0, currentFloorIndex)
          .sort((a, b) => b - a)

        queue = sortedFloors.slice(currentFloorIndex)
          .concat(remainingFloors)
      } else {
        nextFloorIndex = sortedFloors[currentFloorIndex - 1]
        remainingFloors = sortedFloors.slice(currentFloorIndex + 1)

        queue = sortedFloors.slice(0, currentFloorIndex + 1)
          .sort(((a, b) => b - a))
          .concat(remainingFloors)
      }
      // Remove the temporary current floor from the queue before saving
      elevatorDoc.floorsToVisit = queue.filter((item) => {
        return item !== elevatorDoc.currentFloor
      })

      const updatedDoc = await elevatorDoc.save({ new: true })
      return Promise.resolve(updatedDoc)

    } else {
      return reply.conflict(`Floor ${ request.query.floor } is already in queue or is current floor`)
    }

  } catch (err) {
    reply.internalServerError(err)
  }
}

exports.goToQueuedFloors = async (request, reply) => {
  const elevatorDocs = await Elevator.find({ buildingId: request.params.buildingId })
  let count = 0

  for (const item of elevatorDocs) {
    for (const targetFloor of item.floorsToVisit) {
      try {
        await goToFloor(request.params.buildingId, item._id, targetFloor)
        count++
      } catch (err) {
        reply.internalServerError(err)
      }
    }
  }

  reply.send(`${ count } queued actions executed`)
}

const goToFloor = async (builingId, elevatorId, targetFloor) => {
  try {
    const updated = await Elevator.findByIdAndUpdate(elevatorId, {
      currentFloor: targetFloor,
      status: 'open'
    })

    console.log(`Elevator ${ elevatorId } in building ${ builingId } going from floor ${ updated.currentFloor } to ${ targetFloor }`)
    console.log(`Elevator ${ elevatorId } in building ${ builingId } Door open`)

    // Remove floor from queue and close door after it is visited
    await Elevator.findByIdAndUpdate(elevatorId, {
      floorsToVisit: updated.floorsToVisit.slice(1),
      status: 'closed'
    }, { new: true })

    console.log(`Elevator ${ elevatorId } in building ${ builingId } Door closed`)
  } catch (err) {
    return Promise.reject(err)
  }

}
