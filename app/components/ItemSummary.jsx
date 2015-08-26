/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var util = require('../utility/util');


var ItemSummary = React.createClass({
  propTypes: {
    item: React.PropTypes.object.isRequired
  },

  render: function() {
    var item = this.props.item;

    if (!item) {
      return (
        <div className='edit-info'></div>
      );
    }

    return (
      <div className='item-summary row v-double-margin'>
        <div className='two columns'>
          <span className='label'>ID:</span>
          <span className='text-clip'>{item._id}</span>
        </div>

        <div className='four columns'>
          <span className="label">Name:</span>
          <span className='text-clip'>{item.name}</span>
        </div>

        <div className='six columns'>
          <div>
            <span className='label'>Created:</span>
            <span className='text-clip'>{util.formatDate(item.created, {time: true})}</span>
          </div>

          <div>
            <span className='label'>Updated:</span>
            <span className='text-clip'>{util.formatDate(item.updated, {time: true})}</span>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ItemSummary;
