var React  = require('react/addons');
var Router = require('react-router');

var routes = require('./components/App.jsx').routes;

var mountNode = document.getElementById('react-main-mount');

Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(React.createElement(Handler), mountNode);
});
