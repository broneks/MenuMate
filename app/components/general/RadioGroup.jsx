/**
 * @jsx React.DOM
 */

var React = require('react/addons');


var RadioGroup = React.createClass({
  onClick: function(value) {
    this.setValue(value);
  },

  setValue: function(value) {
    this.setState({
      selected: value
    });
  },

  getValue: function() {
    return this.state.selected;
  },

  componentDidMount: function() {
    var defaultValue;
    var child;
    var key;

    for (key in this.props.children) {
      child = this.props.children[key];

      if (child.props.defaultChecked) {
        defaultValue = child.props.value;
        break;
      }
    }

    if (defaultValue) {
      this.setValue(defaultValue);
    }
  },

  render: function() {
    var children = this.props.children.map(function(child) {
      child.props.onClick = this.onClick.bind(this, child.props.value);
      return child;
    }, this);

    return (
      <div className='radio-wrapper'>
        {children}
      </div>
    );
  }
});

module.exports = RadioGroup;
