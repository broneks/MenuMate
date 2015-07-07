/**
 * @jsx React.DOM
 */

var React      = require('react/addons');
var request    = require('superagent');
var State      = require('react-router').State;
var Navigation = require('react-router').Navigation;

var Basket = require('../components/Basket.jsx');

var api = require('../utility/api-endpoints');


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

    if (state.customer) {
      return (
        <div className='checkout'>
          <Basket
            customer={state.customer}
            renderOnlyItems={true}
          />

          <p><strong>Status:</strong> {state.customer.status}</p>
        </div>
        // TODO: add more info
      );
    }

    return (
      <div>no customer</div>
    );
  }
});

module.exports = Checkout;
