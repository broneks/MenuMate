/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var Basket = require('../components/Basket.jsx');
var Menu   = require('../components/Menu.jsx');


Home = React.createClass({
  getInitialState: function() {
    return {
      basketItem: null,
      reactivatedMenuItem: null
    };
  },

  transferBasketItem: function(item) {
    this.setState({
      basketItem: item
    });
  },

  reactivateMenuItem: function(id) {
    this.setState({
      basketItem: null,
      reactivatedMenuItem: id
    });
  },

  clearReactivated: function() {
    this.setState({
      reactivatedMenuItem: null
    });
  },

  render: function() {
    return (
      <div>
        <Basket
          item={this.state.basketItem}
          reactivateMenuItem={this.reactivateMenuItem}
        />
        <Menu
          addToBasket={this.transferBasketItem}
          reactivated={this.state.reactivatedMenuItem}
          clearReactivated={this.clearReactivated}
        />
      </div>
    );
  }
});

module.exports = Home;
