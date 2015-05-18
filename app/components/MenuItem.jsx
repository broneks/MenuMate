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
                <div className='menu-item-type'>{item.type}</div>
                <div className='menu-item-description'>{item.description}</div>
                <div className='menu-item-ingredients'>{item.ingredients}</div>
            </div>
        );
    }
});

var MenuItem = React.createClass({
    getInitialState: function() {
        return {
            showDetails: false
        };
    },

    toggleDetails: function() {
        this.setState({
            showDetails: !this.state.showDetails
        });
    },

    addToBasket: function(e) {
        var props = this.props;

        e.stopPropagation();

        props.addToBasket(props.item);
    },

    componentWillReceiveProps: function(nextProps) {
        if (nextProps.showAsList) {
            this.setState({
                showDetails: false
            });
        }
    },

    render: function() {
        var props = this.props;
        var state = this.state;

        var item    = props.item;
        var price   = util.asCurrency(item.price);
        var image   = props.showAsList ? null : <img className='menu-item-image' src={item.image} alt="" />;
        var details = state.showDetails  ? <MenuItemDetails item={item} /> : null;
        var toggleDetails = props.showAsList ? null : this.toggleDetails ;

        return (
            <div className='menu-item' onClick={toggleDetails}>
                <h4 className='menu-item-name field'>{item.name}</h4>
                <div className='menu-item-price field'>{price}</div>
                {image}
                {details}
                <div className='menu-item-add-wrapper field'>
                    <button className='menu-item-add' onClick={this.addToBasket}>Add</button>
                </div>
            </div>
        );
    }
});

module.exports = MenuItem;