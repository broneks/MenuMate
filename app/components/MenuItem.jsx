/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var util = require('../utility/util');


var MenuItemDetails = React.createClass({
  render: function() {
    var item = this.props.item;

    return (
      <div className='menu-item-details'>
        <div className='menu-item-category field'>{item.category.name}</div>
        <div className='menu-item-description field'>{item.description}</div>
        <div className='menu-item-ingredients field'>{item.ingredients}</div>
      </div>
    );
  }
});

var MenuItem = React.createClass({
  propTypes: {
    item:             React.PropTypes.object.isRequired,
    clearReactivated: React.PropTypes.func,
    reactivated:      React.PropTypes.bool,
    showAsList:       React.PropTypes.bool.isRequired,
    addToBasket:      React.PropTypes.func
  },

  getInitialState: function() {
    return {
      showDetails:   false,
      addedToBasket: false
    };
  },

  toggleDetails: function() {
    this.setState({
      showDetails: !this.state.showDetails
    });
  },

  addToBasket: function(e) {
    e.stopPropagation();

    this.setState({
      addedToBasket: true
    });

    this.props.addToBasket(this.props.item);
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.showAsList) {
      this.setState({
        showDetails: false
      });
    }

    if (nextProps.reactivated) {
      this.setState({
        addedToBasket: false
      });
      this.props.clearReactivated();
    }
  },

  render: function() {
    var state = this.state;
    var props = this.props;

    var item  = props.item;
    var price = util.asCurrency(item.price);
    var image = props.showAsList ? null : <img className='menu-item-image' src={item.image} alt="" />;

    var details       = state.showDetails  ? <MenuItemDetails item={item} /> : null;
    var toggleDetails = props.showAsList ? null : this.toggleDetails;

    var buttonText = this.state.addedToBasket ? 'Added' : 'Add';

    var disabledClass = this.state.addedToBasket ? ' is-disabled' : '';

    return (
      <div className={'menu-item' + disabledClass} onClick={toggleDetails}>
        <div className='menu-item-body'>
          <h4 className='menu-item-name field'>{item.name}</h4>

          <div className='menu-item-price field'>{price}</div>

          {image}
          {details}
        </div>

        <div className='menu-item-add-wrapper field'>
          <button
            className='menu-item-add'
            disabled={this.state.addedToBasket}
            onClick={this.addToBasket}>{buttonText}</button>
        </div>
      </div>
    );
  }
});

module.exports = MenuItem;
