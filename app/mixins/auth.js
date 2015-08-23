var request = require('superagent');
var api     = require('../utility/api-endpoints');

module.exports = {
  isAuthenticated: function(callback) {
    request
      .get(api.auth.isAuthenticated)
      .end(function(err, res) {
        if (err) {
          console.log(err);
          return;
        }

        callback.call(this, res.body);
      }.bind(this));
  }
};
