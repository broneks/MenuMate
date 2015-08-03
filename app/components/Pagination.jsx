/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var util = require('../utility/util');

var LoadingSpinner = require('./LoadingSpinner.jsx');


var Pagination = React.createClass({
  propTypes: {
    listItems:    React.PropTypes.array.isRequired,
    loading:      React.PropTypes.bool.isRequired,
    emptyMessage: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
      currentPage: 0,
      pageLimit:   12
    };
  },

  createPages: function(items) {
    var classes = 'orders-list list-unstyled';
    var pages;

    if (util.isArray(items)) {
      items = util.chunkArray(items, this.state.pageLimit);
      pages = items.map(function(chunk, index) {
        return (
          <ul key={index} className={classes}>{chunk}</ul>
        );
      });
    } else {
      pages = [<ul key={0} className={classes}>{items}</ul>];
    }

    return pages;
  },

  createLinks: function(pages, wrapperClasses) {
    if (pages.length < 2) return;

    var currentPage = this.state.currentPage;

    var links = pages.map(function(_, index) {
      if (index === currentPage) {
          return (
            <span key={index}>{index + 1}</span>
          );
      }

      return (
        <a key={index} onClick={this.changePage.bind(null, index)}>{index + 1}</a>
      );
    }, this);

    return (
      <div className={wrapperClasses}>{links}</div>
    );
  },

  changePage: function(index, e) {
    e.preventDefault();

    this.setState({
      currentPage: index
    });
  },

  getTotal: function() {
    var listItems = this.props.listItems;
    var total     = 0;
    var text      = ' Order';

    if (util.isArray(listItems) && listItems.length) {
      total = listItems.length;
    }

    return total + (total === 1 ? text : text + 's');
  },

  render: function() {
    var state        = this.state;
    var props        = this.props;
    var listItems    = props.listItems;
    var isEmptyClass = '';
    var pages;

    if (!listItems.length) {
      if (props.loading) {
        listItems = <li className='message-center'><LoadingSpinner /></li>;
      } else {
        isEmptyClass = ' is-empty';
        listItems    = <li className='message-center empty-message'>{props.emptyMessage}</li>;
      }
    }

    pages = this.createPages(listItems);

    return (
      <div className={'orders-list-wrapper' + isEmptyClass}>
        {pages[state.currentPage]}

        <div className='pagination-bar row'>
          <div className='orders-total four columns v-margin'>{this.getTotal()}</div>
          {this.createLinks(pages, 'orders-pages eight columns')}
        </div>
      </div>
    );
  }
});

module.exports = Pagination;
