/**
 * @jsx React.DOM
 */

var React  = require('react/addons');
var Router = require('react-router');

var DefaultRoute  = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;
var Link          = Router.Link;
var Route         = Router.Route;
var RouteHandler  = Router.RouteHandler;

var Home     = require('../views/Home.jsx');
var Pending  = require('../views/Pending.jsx');
var Checkout = require('../views/Checkout.jsx');
var NotFound = require('../views/NotFound.jsx');


var App = React.createClass({
  render: function() {
    return (
      <div id='main-wrapper'>
        <header id='main-header'>
          <h1 id='logo'>MenuMate</h1>

          <nav>
            <ul className='list-unstyled'>
              <li><Link to='home'>Home</Link></li>
              <li><Link to='pending'>Pending</Link></li>
            </ul>
          </nav>
        </header>

        <div className='container'>
          <RouteHandler/>
        </div>
      </div>
    );
  }
});

var routes = (
  <Route name='home' path='/' handler={App}>
    <DefaultRoute handler={Home}/>

    <Route name='pending' path='/pending' handler={Pending} />

    <Route name='checkout' path='/checkout/:id' handler={Checkout} />

    <NotFoundRoute handler={NotFound} />
  </Route>
);

module.exports = {
  App:    App,
  routes: routes
};
