/**
 * @jsx React.DOM
 */

var React = require('react/addons');


var Modal = React.createClass({
  propTypes: {
    id:          React.PropTypes.string,
    condition:   React.PropTypes.bool,
    title:       React.PropTypes.string,
    body:        React.PropTypes.oneOfType([
      React.PropTypes.element.isRequired,
      React.PropTypes.node.isRequired,
      React.PropTypes.string.isRequired
    ]),
    buttonText:  React.PropTypes.string.isRequired,
    buttonBlock: React.PropTypes.bool,
    buttonIcon:  React.PropTypes.string,
    onClose:     React.PropTypes.func,
    onOk:        React.PropTypes.func,
    cancelButtonText: React.PropTypes.string,
    okButtonText:     React.PropTypes.string
  },

  getInitialState: function() {
    return {
      open:      false,
      openClass: 'modal-open'
    };
  },

  open: function(e) {
    document.body.classList.add(this.state.openClass);

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
    this.props.onOk();
  },

  componentWillUnmount: function() {
    this.close();
  },

  render: function() {
    var state = this.state;
    var props = this.props;

    var buttonBlock = props.buttonBlock ? ' button-block' : '';
    var buttonIcon  = props.buttonIcon ? <i className={props.buttonIcon}></i> : null;
    var display     = state.open ? 'block' : 'none';
    var footer      = null;

    if (props.onOk) {
      footer = (
        <div className='modal-footer' role='footer'>
          <div className='row'>
            <div className='six columns v-margin'>
              <button className='button button-block' onClick={this.close}>{props.cancelButtonText || 'Cancel'}</button>
            </div>

            <div className='six columns v-margin'>
              <button className='button button-block button-primary' onClick={this.ok}>{props.okButtonText || 'Ok'}</button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className='modal-group'>
        <button className={'modal-button button' + buttonBlock} onClick={this.open} disabled={props.disabled}>
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

          <div className='modal-body' role='document'>
            {props.body}
          </div>

          {footer}
        </div>
      </div>
    );
  }
});

module.exports = Modal;
