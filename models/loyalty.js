//
// Loyalty
//

var mongoose      = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose);

var LoyaltySchema = new mongoose.Schema({
  name: String,
  reward: Number,
  goal: Number,
  startdate: Date,
  description: String,
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

LoyaltySchema.plugin(autoIncrement.plugin, { model: 'Loyalty', startAt: 1 });

module.exports = mongoose.model('Loyalty', LoyaltySchema);
