/**
 * @jsx React.DOM
 */

var React   = require('react');
var request = require('superagent');

var api = require('../utility/api-endpoints');

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

    handleClick: function() {
        this.setState({
            showDetails: !this.state.showDetails
        });
    },

    render: function() {
        var item    = this.props.item;
        var price   = parseFloat(item.price).toFixed(2);
        var details = this.state.showDetails ? <MenuItemDetails item={item} /> : null;

        return (
            <div className='menu-item' onClick={this.handleClick}>
                <h4 className='menu-item-name'>{item.name}</h4>
                <div className='menu-item-price'>${price}</div>
                <img className='menu-item-image' src={item.image} alt="" />
                {details}
            </div>
        );
    }
});

var Menu = React.createClass({
    getInitialState: function() {
        return { 
            items: []
        };
    },

    getMenuItems: function() {
        request
        .get(api.menuItems)
        .end(function(err, res) {
            if (err) console.log(err);

            if (this.isMounted()) {
                this.setState({ items: res.body });
            }
        }.bind(this));
    },

    componentDidMount: function() {
        this.getMenuItems();
    },

    render: function() {
        var itemNodes = this.state.items.map(function (item) {          
          return (
            <MenuItem key={item._id} item={item} />
          );
        });

        return (
          <div className="menu-wrapper">
            <div className="menu">{itemNodes}</div>
          </div>
        );
    }
});

module.exports = Menu;