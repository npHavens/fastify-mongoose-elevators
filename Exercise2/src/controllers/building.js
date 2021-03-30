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
    const buildings = await Building.find()

    if (!buildings) {
      return reply.notFound('No buildings exist')
    }
    return buildings
  } catch (err) {
    return reply.internalServerError(err)
  }
}

exports.getBuildingById = async (request, reply) => {
  try {
    const building = await Building.findById(request.params.buildingId)
    if (!building) {
      return reply.notFound(`No building found for ${ request.params.buildingId }`)
    }
    return building
  } catch (err) {
    return reply.internalServerError(err)
  }
}
