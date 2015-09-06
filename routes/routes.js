//
// Routes
//


var APIroutes = {
  menu:     require('./menu-routes'),
  category: require('./category-routes'),
  order:    require('./order-routes'),
  review:   require('./review-routes'),
  auth:     require('./auth-routes'),
  manage:   require('./manage-menu-routes'),
  loyalty:  require('./customer-loyalty-routes')
};

var React  = require('react/addons');
var Router = require('react-router');

var routes = require('../app/views/App.jsx').routes;

module.exports = function(app, router, config) {
  //
  // Rest API
  //
  for (var type in APIroutes) {
    APIroutes[type](router);
  }


  // route prefix
  app.use('/api', router);


  //
  //  React App
  //
  app.get('*', function(req, res) {
    Router.run(routes, req.path, function (Handler) {
      var reactHtml = React.renderToStaticMarkup(React.createElement(Handler));

      res.render('index', { reactOutput: reactHtml, config: config });
    });
  });
};
