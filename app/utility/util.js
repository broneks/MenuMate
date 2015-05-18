//
// Utility functions
//

module.exports = {
  tax: 1.15,
  asCurrency: function(str) {
    return '$' + parseFloat(str).toFixed(2);
  }
};