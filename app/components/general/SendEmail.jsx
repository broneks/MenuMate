/**
 * @jsx React.DOM
 */

var React = require('react/addons');


var SendEmail = React.createClass({
  propTypes: {
    list:        React.PropTypes.array.isRequired,
    buttonBlock: React.PropTypes.bool
  },

  emailList: function() {
    var mailto = 'mailto:' + this.props.list.join(';');
    window.open(mailto);
  },

  render: function() {
    var props = this.props;
    var blockClass = props.buttonBlock ? 'button-block ' : '';
    var button = props.list.length ? <button className={blockClass + 'v-margin'} onClick={this.emailList}>Send Email</button> : null;

    return (
      <span>
        {button}
      </span>
    );
  }
});

module.exports = SendEmail;
