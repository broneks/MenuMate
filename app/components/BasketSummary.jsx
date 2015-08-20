/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var APP  = require('../../config/app.json');
var util = require('../utility/util');


var BasketSummary = React.createClass({
  propTypes: {
    quantities: React.PropTypes.array.isRequired,
    total:      React.PropTypes.number.isRequired
  },

  getQuantitySum: function(quantities) {
    var quantities = this.props.quantities;

    if (quantities.length) {
      return quantities.reduce(function(prev, curr) {
        return prev + curr;
      });
    }

    return 0;
  },

  render: function() {
    var props    = this.props;

    var quantity = this.getQuantitySum(props.quantities);

    var subtotal = util.asCurrency(props.total);
    var total    = util.asCurrency(props.total * APP.tax);

    return (
      <div className='basket-summary-wrapper'>
        <div className='basket-summary'>
          <div className='basket-summary-quantity field'>{quantity} Item(s)</div>
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
