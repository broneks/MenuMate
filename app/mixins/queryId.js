var request = require('superagent');
var State   = require('react-router').State;

module.exports = {
  mixins: [State],

  getIdParam: function() {
    var id    = this.getParams().id;
    var isInt = /^\d+$/g.test(id);

    if (isInt) {
      return id;
    }
  },

  getById: function(id, endpoint, callback) {
    request
      .get(endpoint + id)
      .end(function(err, res) {
        if (err) {
          console.log(err);
          return;
        }

        if (this.isMounted()) {
          callback.call(this, res.body);
        }
      }.bind(this));
  }
};
