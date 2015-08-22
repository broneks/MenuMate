//
// Utility functions
//

var keys       = Object.keys;
var toString   = Object.prototype.toString;
var arraySlice = Array.prototype.slice;


var util = {
  asCurrency: function(str) {
    return '$' + parseFloat(Math.round(str * 100) / 100).toFixed(2);
  },

  getMonthName: (function() {
    var months = 'Jan Feb Mar Apr May June July Aug Sept Oct Nov Dec'.split(' ');

    return function(num) {
      if (num) {
        return months[num];
      }
    };
  })(),

  formatDate: (function() {
    var precedingZero = function(num) {
      return num < 10 ? '0' + num : num;
    };

    return function(date, options) {
      date    = new Date(date);
      options = options || {};

      var day   = date.getDate();
      var month = util.getMonthName(date.getMonth());
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

  keys: function(obj) {
    return keys(obj);
  },

  addInputsToObj: function(obj, refs) {
    keys(refs).forEach(function(key) {
      var splitKey = key.split('_');
      var node;

      if (splitKey[0] === 'input') {
        node = refs[key].getDOMNode();

        if (node.value && node.type !== 'file') {
          obj[splitKey[1]] = node.value;
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

    if (input) {
      input.classList.add('input-error');
    }
  },

  clearInputErrors: function(names) {
    var inputs = document.getElementsByClassName('input-error');

    util.toArray(inputs).forEach(function(input) {
      input.classList.remove('input-error');
    });
  },

  clearInputs: function(refs) {
    keys(refs).forEach(function(key) {
      var splitKey = key.split('_');
      var node;

      if (splitKey[0] === 'input') {
        node = refs[key].getDOMNode();
        node.value = '';
      }
    });
  }
};

module.exports = util;
