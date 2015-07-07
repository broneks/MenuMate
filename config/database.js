//
// Database
//

var username = '';
var password = '';
var host     = 'localhost';
var port     = '27017';
var database = 'menumate';

var auth = (username && password) ? username + ':' + password + '@' : '';

module.exports = {
  'url': 'mongodb://' + auth + host + ':' + port + '/' + database
};
