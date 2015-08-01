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
var Paid     = require('../views/Paid.jsx');
var Checkout = require('../views/Checkout.jsx');
var Done     = require('../views/Done.jsx');
var NotFound = require('../views/NotFound.jsx');

var FlashMessage = require('./FlashMessage.jsx');

var App = React.createClass({
  getInitialState: function() {
    return {
      flashType:     '',
      flashMessages: []
    };
  },

  flashMessageShow: function(type, messages) {
    this.setState({
      flashType:     type,
      flashMessages: messages
    });
  },

  flashMessageHide: function() {
    this.setState({
      flashType:     '',
      flashMessages: []
    });
  },

  componentWillReceiveProps: function() {
    // clear flash messages when switching routes
    this.flashMessageHide();
  },

  render: function() {
    var state  = this.state;

    // global API
    var global = {
      flashMessage: {
        show: this.flashMessageShow,
        hide: this.flashMessageHide
      }
    };

    return (
      <div id='main-wrapper'>
        <header id='main-header'>
          <h1 id='logo'>MenuMate</h1>

          <nav>
            <ul className='list-unstyled'>
              <li><Link to='home'>Main</Link></li>
              <li><Link to='pending'>Pending</Link></li>
              <li><Link to='paid'>Paid</Link></li>
            </ul>
          </nav>
        </header>

        <div className='container'>
          <FlashMessage
            type={state.flashType}
            messages={state.flashMessages}
          />

          <RouteHandler APP={global} />
        </div>
      </div>
    );
  }
});

var routes = (
  <Route name='home' path='/' handler={App}>
    <DefaultRoute handler={Home} />

    <Route name='pending' path='/pending' handler={Pending} />

    <Route name='paid' path='/paid' handler={Paid} />

    <Route name='checkout' path='/checkout/:id' handler={Checkout} />
    <Route name='confirmation' path='/confirmation/:id' handler={Checkout} />

    <Route name='done' path='/done/:id' handler={Done} />


    <NotFoundRoute handler={NotFound} />
  </Route>
);

module.exports = {
  App:    App,
  routes: routes
};
