/**
 * @jsx React.DOM
 */

var React      = require('react/addons');
var request    = require('superagent');
var Navigation = require('react-router').Navigation;

var api = require('../utility/api-endpoints');

var util = require('../utility/util');


var BasketActions = React.createClass({
  propTypes: {
    items:       React.PropTypes.array.isRequired,
    quantities:  React.PropTypes.array.isRequired,
    total:       React.PropTypes.number.isRequired,
    clearBasket: React.PropTypes.func.isRequired
  },

  mixins: [Navigation],

  checkout: function() {
    var props    = this.props;
    var customer = {};

    if (!this.props.items.length) return;

    customer.items = props.items.map(function(item) {
      return item._id;
    });
    customer.quantities = props.quantities;
    customer.total = props.total * util.tax;

    request
      .post(api.customers)
      .send(customer)
      .set('Accept', 'application/json')
      .end(function(err, res) {
        if (err) {
          console.log('Error');
          return;
        }

        var response = JSON.parse(res.text);

        this.transitionTo('checkout', { id: response.context.id });
      }.bind(this));
  },

  clearBasket: function(e) {
    e.stopPropagation();

    if (!this.props.items.length) return;

    if(confirm('Cancel the current order?')) {
      this.props.clearBasket();
    }
  },

  render: function() {
    return (
      <div className='basket-actions'>
        <button onClick={this.clearBasket}>Cancel</button>
        <button onClick={this.checkout}>Checkout</button>
      </div>
    );
  }
});

module.exports = BasketActions;
