//
// Database
//

var username = '';
var password = '';
var host     = 'localhost';
var port     = '27017';
var database = 'menumate';

module.exports = {
  'url': 'mongodb://' + username + password + host + ':' + port + '/' + database
};
