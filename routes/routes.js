//
// Routes
//

var menuAPI = require('./menu-routes');

var React  = require('react/addons');
var Router = require('react-router');

var App    = require('../app/components/App.jsx').App;
var routes = require('../app/components/App.jsx').routes;

module.exports = function(app, router) {
  //
  //  React App
  //
  app.get('/', function(req, res) {
    Router.run(routes, req.path, function (Handler) {
      var reactHtml = React.renderToString(React.createElement(Handler));

      res.render('index', { reactOutput: reactHtml });
    });
  });


  //
  // Rest API
  //
  menuAPI(router);
  

  // route prefix
  app.use('/api', router);
};