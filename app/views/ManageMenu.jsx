/**
 * @jsx React.DOM
 */

var React      = require('react/addons');
var request    = require('superagent');
var Link       = require('react-router').Link;

var util = require('../utility/util');
var api  = require('../utility/api-endpoints');

var LoadingSpinner = require('../components/general/LoadingSpinner.jsx');
var DividingTitle  = require('../components/general/DividingTitle.jsx');
var Tabs           = require('../components/general/Tabs.jsx');
var ManageItem     = require('../components/ManageItem.jsx');


var ManageMenu = React.createClass({
  getInitialState: function() {
    return {
      menuItems:  [],
      categories: [],
      selected:   null,
      loading:    true
    };
  },

  getMenuItemsAndCategories: function() {
    request
      .get(api.manage.menuItems.standard)
      .end(function(err, res) {
        if (err) {
          console.log(err);
          return;
        }
        var menuItems = res.body;

        request
          .get(api.categories)
          .end(function(err, res) {
            if (err) {
              console.log(err);
              return;
            }

            if (this.isMounted()) {
              this.setState({
                menuItems:  menuItems,
                categories: res.body,
                loading:    false
              });
            }
          }.bind(this));
      }.bind(this));
  },

  getTotal: function(items, singular, plural) {
    var total = 0;

    if (util.isArray(items) && items.length) {
      total = items.length;
    }

    return total + ' ' + (total === 1 ? singular : plural);
  },

  componentDidMount: function() {
    this.getMenuItemsAndCategories();
  },

  render: function() {
    var state = this.state;
    var usedCategories = [];
    var menuItems;
    var categories;
    var menuResult = state.selected ? <MenuResult selected={state.selected} /> : null;

    if (state.loading) {
      return (
        <div className='message-wrapper'>
          <div className='message-center'><LoadingSpinner /></div>
        </div>
      );
    }

    if (state.menuItems.length) {
      menuItems = state.menuItems.map(function(menuItem, index) {
        return (
          <ManageItem
            key={index}
            id={menuItem._id}
            name={menuItem.name}
            details={util.capitalize(menuItem.category.name)}
            status={menuItem.onsale}
            editLink={this.props.APP.config.url.path + '/auth/edit-menu-item/' + menuItem._id}
          />
        );
      }, this);
    } else {
      menuItems = <div className='message-center text-muted'>no menu items</div>;
    }

    if (state.categories.length) {
      categories = state.categories.map(function(category, index) {
        return (
          <ManageItem
            key={index}
            id={category._id}
            name={category.name}
            editLink={this.props.APP.config.url.path + '/auth/edit-menu-category/' + category._id}
          />
        );
      }, this);
    } else {
      categories = <div className='message-center text-muted'>no categories</div>;
    }


    return (
      <div className='manage-menu'>
        <h4>
          <i className='fa fa-pencil-square-o icon-spacing'></i>
          Manage Menu
        </h4>

        <div className='row'>
          <div className='six columns v-margin'>
            <Link to='createMenuCategory' className='button button-block'>Create Menu Category</Link>
          </div>

          <div className='six columns v-margin'>
            <Link to='createMenuItem' className='button button-block'>Create Menu Item</Link>
          </div>
        </div>

        <div className='menu-lists row'>
          <div className='six columns v-margin'>
            <div className='list-wrapper'>
              <ul className='list-unstyled'>
                {categories}
              </ul>
            </div>
            <div className='list-wrapper-summary'>{this.getTotal(categories, 'Category', 'Categories')}</div>
          </div>

          <div className='six columns v-margin'>
            <div className='list-wrapper'>
              <ul className='list-unstyled'>
                {menuItems}
              </ul>
            </div>
            <div className='list-wrapper-summary'>{this.getTotal(menuItems, 'Menu Item', 'Menu Items')}</div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ManageMenu;
