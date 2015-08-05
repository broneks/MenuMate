var request = require('superagent');

module.exports = {
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
