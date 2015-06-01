/**
 * @jsx React.DOM
 */

var React   = require('react/addons');
var request = require('superagent');

var api = require('../utility/api-endpoints');

var MenuItem = require('./MenuItem.jsx');


var Menu = React.createClass({
  propTypes: {
    addToBasket:      React.PropTypes.func,
    reactivated:      React.PropTypes.oneOfType([
                        React.PropTypes.number,
                        React.PropTypes.array
                      ]),
    clearReactivated: React.PropTypes.func
  },

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
        if (err) {
          console.log('Error');
          return;
        }

        if (this.isMounted()) {
          this.setState({
            items: res.body
          });
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
    var state = this.state;
    var props = this.props;

    var itemNodes = state.items.map(function (item) {

      var reactivated = props.reactivated &&
        props.reactivated.toString().indexOf(item._id) > -1;

      return (
        <MenuItem
          key={item._id}
          item={item}
          clearReactivated={props.clearReactivated}
          reactivated={reactivated}
          showAsList={state.listView}
          addToBasket={this.addToBasket}
        />
      );
    }, this);

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
