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