/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var util = require('../utility/util');


var BasketSummary = React.createClass({
  propTypes: {
    quantity: React.PropTypes.number.isRequired,
    total:    React.PropTypes.number.isRequired
  },

  render: function() {
    var props    = this.props;

    var subtotal = util.asCurrency(props.total);
    var total    = util.asCurrency(props.total * util.tax);

    return (
      <div className='basket-summary-wrapper'>
        <div className='basket-summary'>
          <div className='basket-summary-quantity field'>{props.quantity} Item(s)</div>
          <div className='basket-summary-price field'>
            <span className='subtotal'>{subtotal}</span>
            <span className='total'>{total}</span>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = BasketSummary;
