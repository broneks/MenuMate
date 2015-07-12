/**
 * @jsx React.DOM
 */

var React = require('react/addons');
var Link  = require('react-router').Link;


var DividingTitle = React.createClass({
  propTypes: {
    title:  React.PropTypes.string.isRequired,
    dashed: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      dashed: false
    };
  },

  render: function() {
    var props = this.props;
    var typeClass = props.dashed ? '-dashed' : '';

    return (
      <div className={'dividing-title' + typeClass}>
        <hr role='separator' aria-hidden='true' />
        <div className='title'>{props.title}</div>
      </div>
    );
  }
});

module.exports = DividingTitle;
