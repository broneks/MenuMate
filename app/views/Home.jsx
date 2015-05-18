/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var Basket = require('../components/Basket.jsx');
var Menu   = require('../components/Menu.jsx');

Home = React.createClass({
  getInitialState: function() {
    return {
      basketItem: null
    };
  },

  transferBasketItem: function(item) {
    this.setState({
      basketItem: item
    });
  },

  render: function() {
    return (
      <div>
        <Basket item={this.state.basketItem} />
        <Menu addToBasket={this.transferBasketItem} />
      </div>
    );
  }
});

module.exports = Home;