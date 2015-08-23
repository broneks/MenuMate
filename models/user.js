var mongoose      = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var passportLocalMongoose = require('passport-local-mongoose');

autoIncrement.initialize(mongoose);

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  password: String
});

UserSchema.plugin(autoIncrement.plugin, { model: 'User', startAt: 1 });
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
