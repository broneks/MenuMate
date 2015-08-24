/**
 * @jsx React.DOM
 */

var React      = require('react/addons');
var request    = require('superagent');
var Link       = require('react-router').Link;

var api = require('../utility/api-endpoints');

var LoadingSpinner = require('../components/general/LoadingSpinner.jsx');
var DividingTitle  = require('../components/general/DividingTitle.jsx');
var Tabs           = require('../components/general/Tabs.jsx');


var ManageMenu = React.createClass({
  getInitialState: function() {
    return {
      menuitems:  null,
      categories: null,
      loading:    true
    };
  },

  getMenuItemsAndCategories: function() {
    request
      .get(api.manage.menuItems.byCategory)
      .end(function(err, res) {
        if (err) {
          console.log(err);
          return;
        }
        var menuitems = res.body;

        request
          .get(api.categories)
          .end(function(err, res) {
            if (err) {
              console.log(err);
              return;
            }

            if (this.isMounted()) {
              this.setState({
                menuitems:  menuitems,
                categories: res.body,
                loading:    false
              });
            }
          }.bind(this));
      }.bind(this));
  },

  componentDidMount: function() {
    this.getMenuItemsAndCategories();
  },

  render: function() {
    var state = this.state;
    var message;

    if (state.loading) {
      return (
        <div className='message-wrapper'>
          <div className='message-center'><LoadingSpinner /></div>
        </div>
      );
    }

    return (
      <div className='manage-menu'>
        <h4>
          <i className='fa fa-pencil-square-o icon-spacing'></i>
          Manage Menu
        </h4>

        <div className='row'>
          <div className='six columns'>
            <Link to='createMenuItem' className='button button-block'>Create Menu Item</Link>
          </div>

          <div className='six columns'>
            <Link to='createMenuCategory' className='button button-block'>Create Menu Category</Link>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ManageMenu;
