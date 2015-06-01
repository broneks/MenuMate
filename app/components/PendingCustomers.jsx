/**
 * @jsx React.DOM
 */

var React   = require('react/addons');
var request = require('superagent');

var api = require('../utility/api-endpoints');


var PendingCustomers = React.createClass({
  getInitialState: function() {
    return {
      customers: []
    };
  },

  getCustomers: function() {
    request
      .get(api.pending)
      .end(function(err, res) {
        if (err) {
          console.log('Error');
          return;
        }

        if (this.isMounted()) {
          this.setState({
            customers: res.body
          });
        }
      }.bind(this));
  },

  componentDidMount: function() {
    this.getCustomers();
  },

  render: function() {
    var customers = this.state.customers;

    console.log(customers);

    return (
      <div>pending customers</div>
    );
  }
});

module.exports = PendingCustomers;
