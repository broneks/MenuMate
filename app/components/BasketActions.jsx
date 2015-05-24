/**
 * @jsx React.DOM
 */

var React = require('react/addons');


var BasketActions = React.createClass({
  propTypes: {
    items:       React.PropTypes.array.isRequired,
    clearBasket: React.PropTypes.func.isRequired
  },

  checkout: function() {
    console.log(this.props.items);
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
