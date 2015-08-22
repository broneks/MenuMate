/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var util = require('../utility/util');

var Basket = require('../components/Basket.jsx');
var Menu   = require('../components/Menu.jsx');


var Home = React.createClass({
  getInitialState: function() {
    return {
      basket:              [],
      basketItem:          null,
      reactivatedMenuItem: null
    };
  },

  transferBasketItem: function(item) {
    this.setState({
      basket:     this.state.basket.concat([item._id]),
      basketItem: item
    });
  },

  reactivateMenuItem: function(ids) {
    var idsIsArray    = util.isArray(ids);
    var basket        = this.state.basket.slice(0);
    var updatedBasket = basket.filter(function(id) {
      if (idsIsArray) {
        return ids.indexOf(id) === -1;
      }
      return id !== ids;
    });

    this.setState({
      basket:              updatedBasket,
      basketItem:          null,
      reactivatedMenuItem: ids
    });
  },

  clearReactivated: function() {
    this.setState({
      reactivatedMenuItem: null
    });
  },

  render: function() {
    var state = this.state;

    return (
      <div className='home'>
        <Basket
          item={state.basketItem}
          reactivateMenuItem={this.reactivateMenuItem}
        />
        <Menu
          basketIds={state.basket}
          addToBasket={this.transferBasketItem}
          reactivated={state.reactivatedMenuItem}
          clearReactivated={this.clearReactivated}
        />
      </div>
    );
  }
});

module.exports = Home;
