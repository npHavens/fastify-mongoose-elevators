const mongoose = require('mongoose')

const buildingSchema = new mongoose.Schema({
  _id: Number,
  floorCount: Number,
}, { _id : false })

module.exports = mongoose.model('Building', buildingSchema)
