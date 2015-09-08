/**
 * @jsx React.DOM
 */

var React = require('react/addons');
var Link  = require('react-router').Link;

var util = require('../utility/util');


var ManageItem = React.createClass({
  propTypes: {
    id:       React.PropTypes.number.isRequired,
    name:     React.PropTypes.string.isRequired,
    editLink: React.PropTypes.string.isRequired,
    details:  React.PropTypes.string,
    status:   React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      details: ''
    };
  },

  render: function() {
    var props       = this.props;
    var statusClass = '';
    var status;

    if ('status' in props) {
      statusClass = props.status ? ' is-active' : '';
      status      = (
        <span className='item-status'>{props.status ? 'visible' : 'hidden'}</span>
      );
    }

    return (
      <li className={'manage-list-item' + statusClass}>
        <div className='top-row'>
          <span className='item-name field text-clip'>{util.capitalize(props.name)}</span>
          <span className='item-details field text-clip'>{props.details}</span>
        </div>

        <div className='bottom-row'>
          <Link to={props.editLink} className='item-edit button'>Edit</Link>
          {status}
        </div>
      </li>
    );
  }
});

module.exports = ManageItem;
