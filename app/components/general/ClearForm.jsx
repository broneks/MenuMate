/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var util = require('../../utility/util');


var ClearForm = React.createClass({
  propTypes: {
    refs:         React.PropTypes.object.isRequired,
    flashMessage: React.PropTypes.object.isRequired
  },

  clear: function() {
    var props = this.props;

    util.clearInputs(props.refs);
    util.clearInputErrors();
    props.flashMessage.hide();
  },

  render: function() {
    return (
      <a className='clear-form' onClick={this.clear}>Clear the Form</a>
    );
  }
});

module.exports = ClearForm;
