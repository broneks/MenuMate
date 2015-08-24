/**
 * @jsx React.DOM
 */

var React = require('react/addons');


var RadioButton = React.createClass({
  propTypes: {
    id:      React.PropTypes.string.isRequired,
    name:    React.PropTypes.string.isRequired,
    label:   React.PropTypes.string.isRequired,
    value:   React.PropTypes.string.isRequired,
    defaultChecked: React.PropTypes.bool
  },

  render: function() {
    var props = this.props;

    return (
      <label htmlFor={props.id} className='label'>
        <span className='radio-label'>{props.label}</span>
        <input type='radio' id={props.id} name={props.name} value={props.value} defaultChecked={props.defaultChecked} onClick={props.onClick} />
      </label>
    );
  }
});

module.exports = RadioButton;
