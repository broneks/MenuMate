//
// Customer
//

var mongoose      = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose);

var CustomerSchema = new mongoose.Schema({
  items: [{
    type: Number,
    ref: 'MenuItem'
  }],
  quantities: [{
    type: Number
  }],
  total: Number,
  status: {
    type: String,
    default: 'pending'
  },
  method: String,
  postal: String,
  email: String,
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

CustomerSchema.plugin(autoIncrement.plugin, { model: 'Customer', startAt: 1 });

module.exports = mongoose.model('Customer', CustomerSchema);
