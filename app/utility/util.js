//
// Utility functions
//

var keys       = Object.keys;
var toString   = Object.prototype.toString;
var arraySlice = Array.prototype.slice;

var util = {
  TAX: 1.15,

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
  },

  uppercase: function(str) {
    return str.toUpperCase();
  },

  isArray: (function() {
    return Array.isArray || function(value) {
      return toString.call(value) === '[object Array]';
    };
  })(),

  toArray: function(value) {
    return arraySlice.call(value);
  },

  chunkArray: function(arr, chunk) {
    var chunked = [];
    var length  = arr.length;
    var i;

    for (i = 0; i < length; i += chunk) {
      chunked.push(arr.slice(i, i + chunk));
    }

    return chunked;
  },

  addInputsToObj: function(obj, refs) {
    keys(refs).forEach(function(key) {
      var splitKey = key.split('_');
      var value;

      if (splitKey[0] === 'input') {
        value = refs[key].getDOMNode().value;

        if (value) {
          obj[splitKey[1]] = value;
        }
      }
    });

    return obj;
  },

  scrollToTop: function() {
    window.scrollTo(0, 0);
  },

  errorOnInput: function(name) {
    var input = document.getElementsByName(name)[0];
    input.classList.add('input-error');
  },

  clearInputErrors: function(names) {
    var inputs = document.getElementsByClassName('input-error');

    util.toArray(inputs).forEach(function(input) {
      input.classList.remove('input-error');
    });
  }
};

module.exports = util;
