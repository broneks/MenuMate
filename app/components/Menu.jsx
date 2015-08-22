/**
 * @jsx React.DOM
 */

var React   = require('react/addons');
var request = require('superagent');

var util = require('../utility/util');
var api  = require('../utility/api-endpoints');

var MenuItem       = require('./MenuItem.jsx');
var LoadingSpinner = require('./general/LoadingSpinner.jsx');
var Tabs           = require('./general/Tabs.jsx');


var Menu = React.createClass({
  propTypes: {
    addToBasket:      React.PropTypes.func,
    reactivated:      React.PropTypes.oneOfType([
                        React.PropTypes.number,
                        React.PropTypes.array
                      ]),
    clearReactivated: React.PropTypes.func,
    basketIds:        React.PropTypes.array
  },

  getInitialState: function() {
    return {
      items:    {},
      category: null,
      listView: true,
      loading:  true
    };
  },

  getMenuItems: function() {
    request
      .get(api.menuItemsByCategory)
      .end(function(err, res) {
        if (err) {
          console.log(err);
          return;
        }

        if (this.isMounted()) {
          this.setState({
            items:    res.body,
            category: util.keys(res.body)[0],
            loading:  false
          });
        }
      }.bind(this));
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

  setCategory: function(category) {
    this.setState({
      category: category
    })
  },

  getItemsByCategory: function() {
    var state = this.state;
    var props = this.props;

    var items = state.items[state.category].map(function (item, index) {
      var reactivated = props.reactivated && props.reactivated.toString().indexOf(item._id) > -1;

      return (
        <MenuItem
          key={item._id}
          item={item}
          clearReactivated={props.clearReactivated}
          reactivated={reactivated}
          showAsList={state.listView}
          addToBasket={this.addToBasket}
          basketIds={props.basketIds}
        />
      );
    }, this);

    return items;
  },

  componentDidMount: function() {
    this.getMenuItems();
  },

  render: function() {
    var state = this.state;
    var props = this.props;

    var listViewClass  = state.listView ? ' list-view' : '';
    var toggleViewText = state.listView ? 'grid view' : 'list view';
    var items          = null;

    if (util.isObjEmpty(state.items)) {
      if (state.loading) {
        items = <div className='message-center'><LoadingSpinner /></div>;
      }
    } else {
      items = this.getItemsByCategory();
    }

    return (
      <div className='menu-wrapper' ref="menuWrapper">
        <div className='menu-categories'>
          <Tabs items={state.items} onClick={this.setCategory}/>
        </div>

        <div className={'menu' + listViewClass}>{items}</div>

        <div className='menu-display'>
            <button onClick={this.toggleView}>{toggleViewText}</button>
        </div>
      </div>
    );
  }
});

module.exports = Menu;
