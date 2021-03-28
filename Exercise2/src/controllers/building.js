const Building = require('../models/Building.js')

exports.addBuilding = async (req, reply) => {
    try {
      console.log('REQ', req.body)
      const building = new Building(req.body)
      return building.save()
    } catch (err) {
        console.log('ERRRORR', err)
      //throw boom.boomify(err)
    }
}

exports.getBuildings = async (request, reply) => {
    try {
        //console.log('REQ', request.body.buildingId)
      return Building.find()
    } catch (err) {
        console.log('ERRRORR', err)
      //throw boom.boomify(err)
    }
}

exports.getBuildingById = async (request, reply) => {
  try {
      console.log('REQ', request.params)
    return Building.findById(request.params.buildingId)
  } catch (err) {
      console.log('ERRRORR', err)
    //throw boom.boomify(err)
  }
}
