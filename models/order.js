//
// Customer
//

var mongoose      = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose);

var OrderSchema = new mongoose.Schema({
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
  payment: Number,
  change: Number,
  email: String,
  postal: String,
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

OrderSchema.plugin(autoIncrement.plugin, { model: 'Order', startAt: 1 });

module.exports = mongoose.model('Order', OrderSchema);
