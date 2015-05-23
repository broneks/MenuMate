/**
 * @jsx React.DOM
 */

var React   = require('react/addons');
var request = require('superagent');

var api = require('../utility/api-endpoints');

var MenuItem = require('./MenuItem.jsx');


var Menu = React.createClass({
    getInitialState: function() {
        return { 
            listView: true,
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

    toggleView: function(e) {
        e.stopPropagation();

        this.setState({
            listView: !this.state.listView
        });
    },

    addToBasket: function(item) {
        this.props.addToBasket(item);
    },

    render: function() {
        var self  = this;
        var state = this.state;
        var props = this.props;

        var itemNodes = state.items.map(function (item) {          
          var reactivated = props.reactivated === item._id;

          return (
            <MenuItem 
                key={item._id} 
                item={item} 
                reactivated={reactivated}
                showAsList={state.listView} 
                addToBasket={self.addToBasket} />
          );
        });

        var listViewClass  = state.listView ? ' list-view' : '';
        var toggleViewText = state.listView ? 'grid view' : 'list view'; 

        return (
          <div className='menu-wrapper'>
            <div className={'menu' + listViewClass}>{itemNodes}</div>
            <div className='menu-display'>
                <button onClick={this.toggleView}>{toggleViewText}</button>
            </div>
          </div>
        );
    }
});

module.exports = Menu;