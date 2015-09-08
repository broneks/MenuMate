/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var util = require('../../utility/util');


var Modal = React.createClass({
  propTypes: {
    id:          React.PropTypes.string,
    disabled:    React.PropTypes.bool,
    title:       React.PropTypes.string,
    onClose:     React.PropTypes.func,
    onOk:        React.PropTypes.func,
    buttonText:  React.PropTypes.string.isRequired,
    buttonClass: React.PropTypes.string,
    buttonIcon:  React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      disabled:    false,
      buttonClass: ''
    };
  },

  getInitialState: function() {
    return {
      open:      false,
      openClass: 'modal-open'
    };
  },

  open: function(e) {
    document.body.classList.add(this.state.openClass);

    util.scrollToTop();

    this.setState({
      open: true
    });
  },

  close: function() {
    document.body.classList.remove(this.state.openClass);

    this.setState({
      open: false
    });

    if (this.props.onClose) {
      this.props.onClose();
    }
  },

  ok: function() {
    if (this.props.onOk) {
      this.props.onOk();
    }
  },

  componentWillUnmount: function() {
    this.close();
  },

  render: function() {
    var state = this.state;
    var props = this.props;
    var body;
    var footer;

    var display  = state.open ? 'block' : 'none';

    React.Children.forEach(this.props.children, function(child) {
      if (child.type.displayName === 'ModalBody') {
        body = child;
      } else if (child.type.displayName === 'ModalFooter'){
        child.props.onOk    = this.ok;
        child.props.onClose = this.close;
        footer = child;
      }
    }, this);

    var buttonIcon = props.buttonIcon ? <i className={props.buttonIcon}></i> : null;

    return (
      <div className='modal-group'>
        <button className={'modal-button button ' + props.buttonClass} onClick={this.open} disabled={props.disabled}>
          {buttonIcon}
          {props.buttonText}
        </button>

        <div id={props.id} className='modal' role='dialog' style={{ display: display }}>
          <div className='modal-header'>
            <div className='modal-title text-center'>
              {props.title}
            </div>

            <button className='modal-close' onClick={this.close}>
              <i className='fa fa-times'></i>
            </button>
          </div>

          {body}
          {footer}
        </div>
      </div>
    );
  }
});

module.exports = Modal;
