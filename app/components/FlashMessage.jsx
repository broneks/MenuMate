/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var util = require('../utility/util');


var FlashMessage = React.createClass({
  propTypes: {
    messages: React.PropTypes.array,
    type:     React.PropTypes.string
  },

  getInitialState: function() {
    return {
      hidden: true,
      inputNames: []
    };
  },

  hide: function() {
    this.setState({
      hidden: true,
      inputNames: []
    });
  },
z
  showMessageBody: function() {
    var messages = this.props.messages.map(function(message, index) {
      if (message.param) {
        util.errorOnInput(message.param);
      }

      return (
        <li key={index} className='flash-message'>{message.error}</li>
      );
    });

    util.scrollToTop();

    return (
      <ul className='flash-message-body'>{messages}</ul>
    );
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      hidden: !nextProps.messages.length,
      inputNames: []
    });

    util.clearInputErrors();
  },

  render: function() {
    var props = this.props;
    var typeClass = props.type.toLowerCase() || 'info';

    if (this.state.hidden) {
      return (
        <div id="flash-message-wrapper"></div>
      );
    }

    return (
      <div id='flash-message-wrapper' className={'show ' + typeClass}>
        {this.showMessageBody()}

        <button className="flash-message-close" onClick={this.hide}>
          <i className='fa fa-remove'></i>
        </button>
      </div>
    );
  }
});

module.exports = FlashMessage;
