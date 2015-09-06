/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var util = require('../utility/util');


var ItemSummary = React.createClass({
  propTypes: {
    item: React.PropTypes.object
  },

  render: function() {
    var item = this.props.item;

    if (util.isObjEmpty(item)) {
      return (
        <div className='edit-info'></div>
      );
    }

    return (
      <div className='item-summary v-double-margin'>
        <span className='label'>Last Updated:</span>
        <span className='text-clip'>{util.formatDate(item.updated, {time: true})}</span>
      </div>
    );
  }
});

module.exports = ItemSummary;
