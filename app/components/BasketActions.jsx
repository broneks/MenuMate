/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var util = require('../utility/util');


var BasketActions = React.createClass({
  propTypes: {
    items:       React.PropTypes.array.isRequired,
    quantities:  React.PropTypes.array.isRequired,
    total:       React.PropTypes.number.isRequired,
    clearBasket: React.PropTypes.func.isRequired
  },

  checkout: function() {
    var props = this.props;

    console.log(props.items);
    console.log(props.quantities);
    console.log(props.total * util.tax)
  },

  clearBasket: function(e) {
    e.stopPropagation();

    if (confirm('Cancel the current order?')) {
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
