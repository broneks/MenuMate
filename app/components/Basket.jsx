/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var util = require('../utility/util');

var BasketItem = React.createClass({
  remove: function(e) {
    var props = this.props;

    e.stopPropagation();

    props.removeFromBasket(props.item);
  },

  render: function() {
    var item  = this.props.item;
    var price = util.asCurrency(item.price);

    return (
      <li className='basket-item'>
        <span className='basket-item-quantity field'>1</span>
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
      total: 0
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

      this.setState({
        items: updatedItems,
        total: updatedTotal
      });
    }
  },

  removeItem: function(item) {
    var itemIndex    = this.findIndexById(item._id);
    var updatedItems = React.addons.update(this.state.items, {
      '$splice': [[itemIndex, 1]]
    });
    var updatedTotal = this.state.total - item.price;

    this.setState({
      items: updatedItems,
      total: updatedTotal
    });
  },

  componentWillReceiveProps: function(nextProps) {
    this.addItem(nextProps.item);
  },

  render: function() {
    var state = this.state;
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
            <div className='basket-summary-quantity field'>{items.length || 0} Item(s)</div>
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