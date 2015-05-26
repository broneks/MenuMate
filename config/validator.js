//
// Validator
//

module.exports = {
  customValidators: {
    isNumberStr: function(param) {
      if (param === null || Object.prototype.toString.call(param) === '[object Null]') {
        return false;
      }

      return !isNaN(param);
    },
    isPostal: function(param) {
      var validPostal = /^([a-zA-Z]\d[a-zA-Z]\s?\d[a-zA-Z]\d)$/;

      return validPostal.test(param);
    }
  },
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.');
    var root      = namespace.shift();
    var formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }

    return {
      param: formParam,
      error: msg,
      value: value
    };
  }
};
