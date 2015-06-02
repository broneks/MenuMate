//
// Utility functions
//

module.exports = {
  tax: 1.15,
  asCurrency: function(str) {
    return '$' + parseFloat(str).toFixed(2);
  },
  formatDate: (function() {
    var months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');

    return function(date) {
      var date = new Date(date);

      var day   = date.getDate();
      var month = months[date.getMonth()];
      var year  = date.getFullYear();

      return month + ' ' + day + ', ' + year;
    }
  })()
};
