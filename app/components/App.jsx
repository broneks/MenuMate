/**
 * @jsx React.DOM
 */

var React   = require('react');
var request = require('superagent');

var api = require('../utility/api-endpoints');

var MenuItem = React.createClass({
    handleClick: function() {
        this.props.onClick(this.props.item._id);
    },

    render: function() {
        var item  = this.props.item;
        var price = parseFloat(item.price).toFixed(2);

        return (
            <div className="menu-item" onClick={this.handleClick}>
                <span>{item.name} - ${price}</span>
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

    getData: function(url) {
        request
        .get(url)
        .end(function(err, res) {
            if (err) console.log(err);

            var data = Array.isArray(res.body) ? res.body : [res.body];

            if (this.isMounted()) {
                this.setState({ items: data });
            }
        }.bind(this));
    },

    loadMenuItems: function() {
        this.getData(api.menuItems);
    },

    loadItem: function(id) {
        this.getData(api.menuItems + id);
    },

    componentDidMount: function() {
        this.loadMenuItems();
    },

    render: function() {
        var itemNodes = this.state.items.map(function (item) {          
          return (
            <MenuItem key={item._id} item={item} onClick={this.loadItem} />
          );
        }, this);

        return (
          <div className="menu-wrapper">
            <button onClick={this.loadMenuItems}>Load All</button>
            <div className="menu">{itemNodes}</div>
          </div>
        );
    }
});

module.exports = Menu;