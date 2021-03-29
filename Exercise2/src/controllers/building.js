const Building = require('../models/Building.js')

exports.addBuilding = async (req, reply) => {
  try {
    const building = new Building(req.body)
    return building.save()
  } catch (err) {
    return reply.internalServerError(err)
  }
}

exports.getBuildings = async (request, reply) => {
  try {
    return Building.find()
  } catch (err) {
    return reply.internalServerError(err)
  }
}

exports.getBuildingById = async (request, reply) => {
  try {
    return Building.findById(request.params.buildingId)
  } catch (err) {
    return reply.internalServerError(err)
  }
}
