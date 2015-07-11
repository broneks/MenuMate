//
// Routes
//

var APImenu     = require('./menu-routes');
var APIcategory = require('./category-routes');
var APIorder    = require('./order-routes');

var React  = require('react/addons');
var Router = require('react-router');

var routes = require('../app/components/App.jsx').routes;

module.exports = function(app, router) {
  //
  // Rest API
  //
  APImenu(router);
  APIcategory(router);
  APIorder(router);


  // route prefix
  app.use('/api', router);


  //
  //  React App
  //
  app.get('*', function(req, res) {
    Router.run(routes, req.path, function (Handler) {
      var reactHtml = React.renderToString(React.createElement(Handler));

      res.render('index', { reactOutput: reactHtml });
    });
  });
};
