/**
 * @jsx React.DOM
 */

var React      = require('react/addons');
var request    = require('superagent');
var Navigation = require('react-router').Navigation;

var util = require('../utility/util');
var api  = require('../utility/api-endpoints')

var authMixin = require('../mixins/auth');


var Login = React.createClass({
  mixins: [authMixin, Navigation],

  redirect: function() {
    this.transitionTo('main');
  },

  login: function() {
    var refs         = this.refs;
    var loginDetails = {};

    util.addInputsToObj(loginDetails, refs);

    request
      .post(api.auth.login)
      .send(loginDetails)
      .end(function(err, res) {
        if (err) {
          if (err.status === 422) {
            this.props.APP.flashMessage.show('error', res.body.errors);
          } else {
            console.log(err);
          }
          return;
        }

        if (res.body.authenticated) {
          this.redirect();
        } else {
          this.props.APP.flashMessage.show('error', res.body.errors);
        }
      }.bind(this));
  },

  componentDidMount: function() {
    this.isAuthenticated(function(res) {
      if (res) {
        this.redirect();
      }
    });
  },

  render: function() {
    return (
      <div className='login center-form'>
        <h4>
          <i className='fa fa-sign-in icon-spacing'></i>
          Login
        </h4>

        <div className='row'>
          <label htmlFor='username' className='label'>Username</label>
          <input type='text' ref='input_username' name='username' className='u-full-width' autoFocus />
        </div>

        <div className='row'>
          <label htmlFor='password' className='label'>Password</label>
          <input type='password' ref='input_password' name='password' className='u-full-width' />
        </div>

        <div className='row v-double-margin'>
          <button className='button-primary button-block' onClick={this.login}>Login</button>
        </div>
      </div>
    );
  }
});

module.exports = Login;
