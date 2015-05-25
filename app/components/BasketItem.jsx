/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var util = require('../utility/util');


var BasketItem = React.createClass({
  propTypes: {
    item:             React.PropTypes.object.isRequired,
    updateSummary:    React.PropTypes.func,
    removeFromBasket: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      quantity: "1"
    };
  },

  remove: function(e) {
    e.stopPropagation();

    var props    = this.props;
    var quantity = parseInt(this.state.quantity);

    props.removeFromBasket(props.item, quantity);
  },

  updateQuantity: function(e) {
    var props            = this.props;
    var originalQuantity = parseInt(this.state.quantity);
    var newQuantity      = parseInt(e.target.value);
    var difference       = newQuantity - originalQuantity;

    this.setState({
      quantity: e.target.value
    });

    props.updateSummary(difference, props.item.price);
  },

  render: function() {
    var state = this.state;
    var props = this.props;

    var item  = props.item;
    var price = util.asCurrency(item.price);

    return (
      <li className='basket-item'>
        <span className='basket-item-quantity field'>
          <select defaultValue={state.quantity} onChange={this.updateQuantity}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </span>
        <span className='basket-item-name field text-clip'>{item.name}</span>
        <span className='basket-item-category field text-clip'>{item.category.name}</span>
        <span className='basket-item-price field'>{price}</span>
        <span className='basket-item-remove-wrapper field'>
          <button className='basket-item-remove' onClick={this.remove}>X</button>
        </span>
      </li>
    );
  }
});

module.exports = BasketItem;
