/**
 * @jsx React.DOM
 */


var React  = require('react/addons');
var Router = require('react-router');

var app = require('../../config/app.json');

var DefaultRoute  = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;
var Link          = Router.Link;
var Route         = Router.Route;
var RouteHandler  = Router.RouteHandler;
var Navigation    = Router.Navigation;

var FlashMessage = require('../components/general/FlashMessage.jsx');
var authMixin    = require('../mixins/auth');

var Pending  = require('./Pending.jsx');
var Paid     = require('./Paid.jsx');
var Home     = require('./Home.jsx');
var Checkout = require('./Checkout.jsx');
var Done     = require('./Done.jsx');
var Review   = require('./Review.jsx');
var NotFound = require('./NotFound.jsx');

// Admin Views
var Login  = require('./Login.jsx');
var Logout = require('./Logout.jsx');
var CreateMenuItem = require('./CreateMenuItem.jsx');



var App = React.createClass({
  mixins: [authMixin],

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

  componentDidMount: function() {
    // initalize authenticated flag
    this.isAuthenticated(function(res) {
      this.setState({
        authenticated: res
      });
    });
  },

  componentWillReceiveProps: function() {
    // clear flash messages when switching routes
    this.flashMessageHide();

    this.isAuthenticated(function(res) {
      if (res) {
        if (!this.state.authenticated) {
          this.setState({
            authenticated: true
          });
        }
      } else {
        if (this.state.authenticated) {
          this.setState({
            authenticated: false
          });
        }
      }
    });
  },

  render: function() {
    var state = this.state;
    var authLinks;
    var loginOrLogout;

    // global API
    var global = {
      flashMessage: {
        show: this.flashMessageShow,
        hide: this.flashMessageHide
      },
      config: app
    };

    Object.seal(global);

    if (state.authenticated) {
      authLinks = [
        <li key={0}><Link to='createMenuItem'>Create Menu</Link></li>
      ];
      loginOrLogout = <li className='auth-link logout'><Link to='logout'>Logout</Link></li>;
    } else {
      loginOrLogout = <li className='auth-link login'><Link to='auth'>Login</Link></li>;
    }

    return (
      <div id='main-wrapper'>
        <header id='main-header'>
          <h1 id='logo'>{app.name}</h1>

          <nav>
            <ul className='list-unstyled'>
              <li><Link to='main'>Main</Link></li>
              <li><Link to='pending'>Pending</Link></li>
              <li><Link to='paid'>Paid</Link></li>
              <li><Link to='review'>Review</Link></li>

              {authLinks}
              {loginOrLogout}
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

var Auth = React.createClass({
  mixins: [authMixin, Navigation],

  checkAuth: function() {
    this.isAuthenticated(function(res) {
      if (!res) {
        this.transitionTo('auth');
      }
    });
  },

  componentDidMount: function() {
    this.checkAuth();
  },

  componentWillUpdate: function() {
    this.checkAuth();
  },

  render: function() {
    return (
      <div className='auth-wrapper'>
        <RouteHandler APP={this.props.APP} />
      </div>
    );
  }
});

var routes = (
  <Route name='main' path='/' handler={App}>
    <DefaultRoute handler={Home} />

    <Route name='pending' path='/pending' handler={Pending} />

    <Route name='paid' path='/paid' handler={Paid} />

    <Route name='checkout' path='/checkout/:id' handler={Checkout} />
    <Route name='confirmation' path='/confirmation/:id' handler={Checkout} />

    <Route name='done' path='/done/:id' handler={Done} />

    <Route name='review' path='/review' handler={Review} />

    /* Admin Routes */
    <Route name='auth' path='/auth' handler={Auth}>
      <DefaultRoute handler={Login} />

      <Route name='logout' path='/auth/logout' handler={Logout} />

      <Route name='createMenuItem' path='/auth/create-menu' handler={CreateMenuItem} />
    </Route>

    <NotFoundRoute handler={NotFound} />
  </Route>
);
      // <Route name='logout' path='/auth/logout' handler={Logout} />

module.exports = {
  App:    App,
  routes: routes
};
