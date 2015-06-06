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
    var emptyMessageClass = '';
    var links;

    if (customers.length) {
      links = customers.map(function(customer) {
        var id   = customer._id;
        var date = util.formatDate(customer.created, {
          time: true
        });

        return (
          <li key={id} className='pending-customer-item'>
            <Link to='checkout' params={{ id: id }} className='row'>
              <div className='four columns'>Customer #{id}</div>
              <div className='five columns'>{date}</div>
              <div className='three columns'>Items: {customer.items.length}</div>
            </Link>
          </li>
        );
      });
    } else {
      links = <li className='empty-message'>no pending customers</li>;
      emptyMessageClass = ' is-empty';
    }

    return (
      <div>
        <h4>Pending Customers</h4>

        <ul className={'pending-customers list-unstyled' + emptyMessageClass}>
          {links}
        </ul>
      </div>
    );
  }
});

module.exports = PendingCustomers;
