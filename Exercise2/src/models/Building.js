const mongoose = require('mongoose')

const buildingSchema = new mongoose.Schema({
  _id: Number,
  floorCount: Number,
}, { _id : false })

// buildingSchema.pre('save', function(next) {
//   //if (foo()) {
//     console.log('SAVING');
//     // `return next();` will make sure the rest of this function doesn't run
//     /*return*/ next();
//   //}
//   // Unless you comment out the `return` above, 'after next' will print
//   console.log('after next');
// });

module.exports = mongoose.model('Building', buildingSchema)
