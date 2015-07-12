/**
 * @jsx React.DOM
 */

var React = require('react/addons');
var Link  = require('react-router').Link;


var Modal = React.createClass({
  propTypes: {
    modalTitle:  React.PropTypes.string,
    modalBody:   React.PropTypes.oneOfType([
      React.PropTypes.element.isRequired,
      React.PropTypes.node.isRequired,
      React.PropTypes.string.isRequired
    ]),
    buttonText:  React.PropTypes.string.isRequired,
    buttonBlock: React.PropTypes.bool,
    buttonIcon:  React.PropTypes.string,
    id:          React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      buttonBlock: false,
      buttonIcon:  '',
      modalTitle:  ''
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

    this.setState({
      open: true
    });
  },

  close: function() {
    document.body.classList.remove(this.state.openClass);

    this.setState({
      open: false
    });
  },

  render: function() {
    var state = this.state;
    var props = this.props;
    var buttonBlock = props.buttonBlock ? ' button-block' : '';
    var buttonIcon  = props.buttonIcon.length ? <i className={props.buttonIcon}></i> : null;
    var display     = state.open ? 'block' : 'none';

    return (
      <div className='modal-group'>
        <button className={'modal-button button' + buttonBlock} onClick={this.open}>
          {buttonIcon}
          {props.buttonText}
        </button>

        <div id={props.id} className='modal' role='dialog' style={{ display: display }}>
          <div className='modal-header'>
            <div className='modal-title text-center'>
              {props.modalTitle}
            </div>

            <button className='modal-close' onClick={this.close}>
              <i className='fa fa-times'></i>
            </button>
          </div>

          <div className='modal-body' role='document'>
            {props.modalBody}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Modal;
