/**
 * @jsx React.DOM
 */

var React      = require('react/addons');
var request    = require('superagent');
var Navigation = require('react-router').Navigation;
var Link       = require('react-router').Link;

var api = require('../utility/api-endpoints');

var util = require('../utility/util');


var PendingCustomers = React.createClass({

  mixins: [Navigation],

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

    var links = customers.map(function(customer) {
      var id   = customer._id;
      var date = util.formatDate(customer.created);

      return (
        <li key={id}>
          <Link to='checkout' params={{ id: id }}>
            <div>Customer #{id}</div>
            <div>Items: {customer.items.length}</div>
            <div>Created: {date}</div>
          </Link>
        </li>
      );
    });

    return (
      <div>
        <p>Pending Customers</p>

        <ul>
          {links}
        </ul>
      </div>
    );
  }
});

module.exports = PendingCustomers;
