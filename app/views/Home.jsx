/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var Basket = require('../components/Basket.jsx');
var Menu   = require('../components/Menu.jsx');


var Home = React.createClass({
  getInitialState: function() {
    return {
      basketItem:          null,
      reactivatedMenuItem: null
    };
  },

  transferBasketItem: function(item) {
    this.setState({
      basketItem: item
    });
  },

  reactivateMenuItem: function(ids) {
    this.setState({
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
          addToBasket={this.transferBasketItem}
          reactivated={state.reactivatedMenuItem}
          clearReactivated={this.clearReactivated}
        />
      </div>
    );
  }
});

module.exports = Home;
