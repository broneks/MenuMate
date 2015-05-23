/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var util = require('../utility/util');

var BasketItem = React.createClass({
  getInitialState: function() {
    return {
      quantity: "1"
    };
  },

  remove: function(e) {
    var props    = this.props;
    var quantity = parseInt(this.state.quantity);

    e.stopPropagation();

    props.removeFromBasket(props.item, quantity);
  },

  updateQuantity: function(e) {
    var props            = this.props;
    var originalQuantity = parseInt(this.state.quantity);
    var newQuantity      = parseInt(e.target.value);
    var difference;

    this.setState({
      quantity: e.target.value
    });

    difference = newQuantity - originalQuantity;

    props.updateSummary(difference, props.item.price);
  },

  render: function() {
    var item  = this.props.item;
    var price = util.asCurrency(item.price);

    return (
      <li className='basket-item'>
        <span className='basket-item-quantity field'>
          <select defaultValue={this.state.quantity} onChange={this.updateQuantity}>
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
        <span className='basket-item-type field text-clip'>{item.type}</span>
        <span className='basket-item-price field'>{price}</span>            
        <span className='basket-item-remove-wrapper field'>
          <button className='basket-item-remove' onClick={this.remove}>X</button>
        </span>
      </li>
    );
  }
});

var Basket = React.createClass({
  getInitialState: function() {
    return {
      items: [],
      total: 0,
      quantity: 0
    };
  },

  findIndexById: function(id) {
    var basketItemIDs = this.state.items
      .map(function(basketItem) {
        return basketItem._id;
      });

    return basketItemIDs.indexOf(id);
  },

  checkForNoDuplicates: function(id) {
    if (!this.state.items.length) return true;

    return this.findIndexById(id) === -1;
  },

  addItem: function(item) {
    var updatedItems;
    var updatedTotal;

    if (this.checkForNoDuplicates(item._id)) {
      updatedItems = React.addons.update(this.state.items, {
        '$push': [item]
      });

      updatedTotal = this.state.total + item.price;
      updatedQuantity = this.state.quantity += 1;

      this.setState({
        items: updatedItems,
        total: updatedTotal,
        quantity: updatedQuantity
      });
    }
  },

  removeItem: function(item, quantity) {
    var itemIndex    = this.findIndexById(item._id);
    var updatedItems = React.addons.update(this.state.items, {
      '$splice': [[itemIndex, 1]]
    });
    var updatedTotal    = this.state.total - item.price * quantity;
    var updatedQuantity = this.state.quantity - quantity;

    this.setState({
      items: updatedItems,
      total: updatedTotal,
      quantity: updatedQuantity
    });

    this.props.reactivateMenuItem(item._id);
  },

  updateSummary: function(quantity, price) {
    var updatedQuantity = this.state.quantity + quantity;
    var updatedTotal    = this.state.total + price * quantity;

    this.setState({
      quantity: updatedQuantity,
      total: updatedTotal
    });
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.item) {
      this.addItem(nextProps.item);
    }
  },

  render: function() {
    var state    = this.state;
    var subtotal = util.asCurrency(state.total);
    var total    = util.asCurrency(state.total * util.tax);
    var emptyMessageClass = '';
    var items;

    if (state.items.length) {
      items = state.items.map(function(item) {
        return (
          <BasketItem 
            key={item._id} 
            item={item} 
            updateSummary={this.updateSummary}
            removeFromBasket={this.removeItem} />
        );
      }, this);
    } else {
      items = <li className='basket-empty-message'>basket is empty</li>
      emptyMessageClass = ' is-empty';
    }

    return (
      <div className='basket-wrapper'>
        <div className={'basket' + emptyMessageClass}>
          <div className='basket-items-wrapper'>
            <ul className='basket-items list-unstyled'>{items}</ul>
          </div>
        </div>
        <div className='basket-summary-wrapper'>
          <div className='basket-summary'>
            <div className='basket-summary-quantity field'>{this.state.quantity} Item(s)</div>
            <div className='basket-summary-price field'>
              <span className='subtotal'>{subtotal}</span>
              <span className='total'>{total}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Basket;