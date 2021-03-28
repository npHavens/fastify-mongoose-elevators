const mongoose = require('mongoose')

const elevatorSchema = new mongoose.Schema({
  _id: String,
  buildingId: {
    type: Number,
    ref: 'Elevator'
   },
  currentFloor: { type: Number, default: 1 },
  floorsToVisit:  {
    type: mongoose.Schema.Types.Array,
  },
  status: { type: String, default: 'closed' }
}, { _id: false })

module.exports = mongoose.model('Elevator', elevatorSchema)
