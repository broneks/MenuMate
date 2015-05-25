//
// Menu Item
//

var mongoose      = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose);

var MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  category: {
    type: Number,
    ref: 'Category'
  },
  ingredients: String,
  description: String,
  image: String,
  price: Number,
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

MenuItemSchema.plugin(autoIncrement.plugin, { model: 'MenuItem', startAt: 1 });

MenuItemSchema.path('description').validate(function(description) {
  return description && description.length <= 255;
}, 'description must be 255 characters or less');

module.exports = mongoose.model('MenuItem', MenuItemSchema);
