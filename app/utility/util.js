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

    return function(date, options) {
      date    = new Date(date);
      options = options || {};


      var day   = date.getDate();
      var month = months[date.getMonth()];
      var year  = date.getFullYear();

      var time = options.time ? date.getHours() + ':' + date.getMinutes() : '';

      return month + ' ' + day + ', ' + year + ' at ' + time;
    };
  })()
};
