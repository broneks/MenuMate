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
    var props = this.props;
    var order = {};

    if (!this.props.items.length) return;

    order.items = props.items.map(function(item) {
      return item._id;
    });
    order.quantities = props.quantities;
    order.total = props.total;

    request
      .post(api.orders)
      .send(order)
      .set('Accept', 'application/json')
      .end(function(err, res) {
        if (err) {
          console.log(err);
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
        <div className='row'>
          <div className='three columns'>
            <button className='button button-block' onClick={this.clearBasket}>Cancel</button>
          </div>

          <div className='five columns'>
            <button className='button button-block button-primary' onClick={this.checkout}>Checkout</button>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = BasketActions;
