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
var Checkout = require('../views/Checkout.jsx');


var App = React.createClass({
  render: function() {
    return (
      <div>
        <header>
          <ul className='list-unstyled'>
            <li><Link to="home">Home</Link></li>
            <li><Link to="checkout">Checkout</Link></li>
          </ul>
        </header>

        <RouteHandler/>
      </div>
    );
  }
});

var routes = (
  <Route name="home" path="/" handler={App}>
    <DefaultRoute handler={Home}/>
    <Route name="checkout" path="/checkout" handler={Checkout}/>
  </Route>
);

module.exports = {
  App:    App,
  routes: routes
};