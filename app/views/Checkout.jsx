/**
 * @jsx React.DOM
 */

var React      = require('react/addons');
var request    = require('superagent');
var State      = require('react-router').State;
var Navigation = require('react-router').Navigation;

var Basket = require('../components/Basket.jsx');

var api = require('../utility/api-endpoints');
var util = require('../utility/util');


var Checkout = React.createClass({
  mixins: [State, Navigation],

  getInitialState: function() {
    return {
      customer: null
    };
  },

  getId: function() {
    var id    = this.getParams().id;
    var isInt = /^\d+$/g.test(id);

    if (isInt) {
      return id;
    } else {
      this.transitionTo('pending');
    }
  },

  getCustomerById: function(id, callback) {
    request
      .get(api.customers + id)
      .end(function(err, res) {
        if (err) {
          console.log('Error');
          return;
        }

        if (this.isMounted()) {
          this.setState({
            customer: res.body
          });
        }
      }.bind(this));
  },

  componentDidMount: function() {
    var id = this.getId();

    if (id) {
      this.getCustomerById(id);
    }
  },

  render: function() {
    var state = this.state;
    var status;
    var created;

    if (state.customer) {
      status  = util.capitalize(state.customer.status);
      created = util.formatDate(state.customer.created, {
        time: true
      });

      return (
        <div className='checkout'>
          <div className='order-info row'>
            <div className='six columns'><strong>Status:</strong> {status}</div>
            <div className='six columns'><strong>Order Created:</strong> {created}</div>
          </div>

          <Basket
            customer={state.customer}
            renderStaticItems={true}
          />

        </div>
        // TODO: add more info
      );
    }

    return (
      <div className='text-center'>No customer order was found</div>
    );
  }
});

module.exports = Checkout;
