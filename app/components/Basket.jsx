/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var util = require('../utility/util');

var BasketActions = require('./BasketActions.jsx');
var BasketItem    = require('./BasketItem.jsx');
var BasketSummary = require('./BasketSummary.jsx');


var Basket = React.createClass({
  propTypes: {
    customer:           React.PropTypes.object,
    item:               React.PropTypes.object,
    reactivateMenuItem: React.PropTypes.func,
    renderOnlyItems:    React.PropTypes.bool
  },

  getInitialState: function() {
    return {
      items:      [],
      quantities: [],
      total:      0
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
      updatedItems      = React.addons.update(this.state.items, { '$push': [item] });
      updatedQuantities = React.addons.update(this.state.quantities, { '$push': [1] });
      updatedTotal      = this.state.total + item.price;

      this.setState({
        items:      updatedItems,
        quantities: updatedQuantities,
        total:      updatedTotal
      });
    }
  },

  removeItem: function(item, quantity) {
    var itemIndex = this.findIndexById(item._id);
    var splice    = {
      '$splice': [[itemIndex, 1]]
    };
    var updatedItems      = React.addons.update(this.state.items, splice);
    var updatedQuantities = React.addons.update(this.state.quantities, splice);
    var updatedTotal      = this.state.total - item.price * quantity;

    this.setState({
      items:      updatedItems,
      quantities: updatedQuantities,
      total:      updatedTotal
    });

    this.props.reactivateMenuItem(item._id);
  },

  clearItems: function() {
    var idList = this.state.items.map(function(item) {
      return item._id;
    });

    this.props.reactivateMenuItem(idList);

    this.setState({
      items:      [],
      quantities: [],
      total:      0
    });
  },

  updateSummary: function(item, quantity, price) {
    var itemIndex         = this.findIndexById(item._id);
    var updatedQuantities = React.addons.update(this.state.quantities, {
      '$apply': function(quantities) {
        quantities[itemIndex] += quantity;
        return quantities;
      }
    });
    var updatedTotal = this.state.total + price * quantity;

    this.setState({
      quantities: updatedQuantities,
      total:      updatedTotal
    });
  },

  componentWillMount: function() {
    var props = this.props;

    if (props.customer) {
      this.setState({
        items:      props.customer.items,
        quantities: props.customer.quantities,
        total:      props.customer.total
      });
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.item) {
      this.addItem(nextProps.item);
    }
  },

  render: function() {
    var state = this.state;
    var props = this.props;

    var emptyMessageClass = '';
    var items;

    if (state.items.length) {
      items = state.items.map(function(item, index) {
        return (
          <BasketItem
            key={item._id}
            item={item}
            quantity={state.quantities[index]}
            updateSummary={this.updateSummary}
            removeFromBasket={this.removeItem}
            renderOnlyItems={props.renderOnlyItems}
          />
        );
      }, this);
    } else {
      items = <li className='empty-message'>basket is empty</li>
      emptyMessageClass = ' is-empty';
    }

    if (props.renderOnlyItems) {
      return (
        <div className='basket-wrapper'>
          <div className={'basket only-items' + emptyMessageClass}>
            <div className='basket-items-wrapper'>
              <ul className='basket-items list-unstyled'>{items}</ul>
            </div>
          </div>

          <BasketSummary quantities={state.quantities} total={state.total} />
        </div>
      );
    }

    return (
      <div className='basket-wrapper'>
        <BasketActions
          items={state.items}
          quantities={state.quantities}
          total={state.total}
          clearBasket={this.clearItems}
        />

        <div className={'basket' + emptyMessageClass}>
          <div className='basket-items-wrapper'>
            <ul className='basket-items list-unstyled'>{items}</ul>
          </div>
        </div>

        <BasketSummary quantities={state.quantities} total={state.total} />
      </div>
    );
  }
});

module.exports = Basket;
