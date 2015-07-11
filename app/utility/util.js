//
// Utility functions
//

module.exports = {
  tax: 1.15,

  asCurrency: function(str) {
    return '$' + parseFloat(str).toFixed(2);
  },

  formatDate: (function() {
    var months = 'Jan Feb Mar Apr May June July Aug Sept Oct Nov Dec'.split(' ');

    var precedingZero = function(num) {
      return num < 10 ? '0' + num : num;
    };

    return function(date, options) {
      date    = new Date(date);
      options = options || {};


      var day   = date.getDate();
      var month = months[date.getMonth()];
      var year  = date.getFullYear();

      var time = options.time ? precedingZero(date.getHours()) + ':' + precedingZero(date.getMinutes()) : '';

      return month + ' ' + day + ', ' + year + ' at ' + time;
    };
  })(),

  capitalize: function(str) {
    return str.toLowerCase().replace(/\b\w/g, function(m) {
      return m.toUpperCase();
    });
  }
};
