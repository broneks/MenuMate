//
// Customer
//

var mongoose      = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose);

var CustomerSchema = new mongoose.Schema({
  name: {
    type: String
  },
  postal: String,
  code: {
    type: String,
    unique: true
  },
  orders: [{
    type: Number,
    ref: 'Order'
  }],
  rewards: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      wallet: 0
    }
  },
  lastreward: Date,
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
