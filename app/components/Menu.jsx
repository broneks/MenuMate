/**
 * @jsx React.DOM
 */

var React   = require('react/addons');
var request = require('superagent');

var api = require('../utility/api-endpoints');

var MenuItem       = require('./MenuItem.jsx');
var LoadingSpinner = require('./general/LoadingSpinner.jsx');


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
      items:    [],
      listView: true,
      loading:  true,
      scrollPos: {
        listView : 0,
        gridView : 0,
        current  : 0
      }
    };
  },

  getMenuItems: function() {
    request
      .get(api.menuItems)
      .end(function(err, res) {
        if (err) {
          console.log(err);
          return;
        }

        if (this.isMounted()) {
          this.setState({
            items:   res.body,
            loading: false
          });
        }
      }.bind(this));
  },

  componentDidMount: function() {
    this.getMenuItems();
  },

  toggleView: function(e) {
    e.stopPropagation();

    this.setScrollPosition();

    this.setState({
      listView: !this.state.listView
    });
  },

  addToBasket: function(item) {
    this.props.addToBasket(item);
  },

  getScrollPosition: function(e) {
    var scrollTop = e.target.scrollTop;
    var propObj   = {};

    if (this.state.listView) {
      propObj.listView = {$set: scrollTop};
    } else {
      propObj.gridView = {$set: scrollTop};
    }

    var updatedPos = React.addons.update(this.state.scrollPos, propObj);

    this.setState({
      scrollPos: updatedPos
    });
  },

  setScrollPosition: function() {
    var nextViewType = this.state.listView ? 'gridView': 'listView';

    this.state.scrollPos.current = this.state.scrollPos[nextViewType];
  },

  componentDidUpdate: function() {
    var menuWrapper = React.findDOMNode(this.refs.menuWrapper);

    // DEBUG
    menuWrapper.scrollTop = this.state.scrollPos.current;
  },

  render: function() {
    var state = this.state;
    var props = this.props;

    var listViewClass  = state.listView ? ' list-view' : '';
    var toggleViewText = state.listView ? 'grid view' : 'list view';

    var items = state.items.map(function (item) {
      var reactivated = props.reactivated && props.reactivated.toString().indexOf(item._id) > -1;

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

    if (!items.length) {
      if (state.loading) {
        items = <div className='message-center'><LoadingSpinner /></div>;
      }
    }

    return (
      <div className='menu-wrapper' onScroll={this.getScrollPosition} ref="menuWrapper">
        <div className={'menu' + listViewClass}>{items}</div>
        <div className='menu-display'>
            <button onClick={this.toggleView}>{toggleViewText}</button>
        </div>
      </div>
    );
  }
});

module.exports = Menu;
