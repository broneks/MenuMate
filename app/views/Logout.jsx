/**
 * @jsx React.DOM
 */

var React      = require('react/addons');
var request    = require('superagent');
var Navigation = require('react-router').Navigation;

var api = require('../utility/api-endpoints')


var Logout = React.createClass({
  mixins: [Navigation],

  redirect: function() {
    this.transitionTo('main');
  },

  logout: function() {
    request
      .get(api.auth.logout)
      .end(function(err, res) {
        if (err) {
          if (err.status === 422) {
            this.props.APP.flashMessage.show('error', res.body.errors);
          } else {
            console.log(err);
          }
        }
      }.bind(this));
  },

  componentWillMount: function() {
    this.logout();
  },

  componentDidMount: function() {
    this.redirect();
  },

  render: function() {
    return (
      <div className='logout'>
        <h4>
          <i className='fa fa-sign-out icon-spacing'></i>
          Sign out
        </h4>

        <p>Please wait to be redirected</p>
      </div>
    );
  }
});

module.exports = Logout;
