var React = require('react');
var ReactApp = React.createFactory(require('./components/App.jsx'));

var mountNode = document.getElementById('react-main-mount');

React.render(new ReactApp({}), mountNode);