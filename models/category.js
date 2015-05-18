//
// Category
//

var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose);

var CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  }
});

CategorySchema.plugin(autoIncrement.plugin, { model: 'Category', startAt: 1 });

module.exports = mongoose.model('Category', CategorySchema);