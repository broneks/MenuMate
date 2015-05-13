/**
 * @jsx React.DOM
 */

var React  = require('react');
var Router = require('react-router');

var DefaultRoute  = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;
var Link          = Router.Link;
var Route         = Router.Route;
var RouteHandler  = Router.RouteHandler;

var Menu     = require('./Menu.jsx');
var Checkout = require('./Checkout.jsx');

var App = React.createClass({
  render: function() {
    return (
      <div>
        <header>
          <ul>
            <li><Link to="menu">Menu</Link></li>
            <li><Link to="checkout">Checkout</Link></li>
          </ul>
        </header>

        <RouteHandler/>
      </div>
    );
  }
});

var routes = (
  <Route name="menu" path="/" handler={App}>
    <DefaultRoute handler={Menu}/>
    <Route name="checkout" path="/checkout" handler={Checkout}/>
  </Route>
);

module.exports = {
  App:    App,
  routes: routes
};