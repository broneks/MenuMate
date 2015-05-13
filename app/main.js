var React  = require('react');
var Router = require('react-router');

var App    = require('./components/App.jsx').App;
var routes = require('./components/App.jsx').routes; 

var mountNode = document.getElementById('react-main-mount');

Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(React.createElement(Handler), mountNode);
});