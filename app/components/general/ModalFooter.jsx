/**
 * @jsx React.DOM
 */

var React = require('react/addons');


var ModalFooter = React.createClass({
  propTypes: {
      cancelButtonText: React.PropTypes.string,
      okButtonText:     React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      cancelButtonText: 'Cancel',
      okButtonText:     'Ok'
    }
  },

  render: function() {
    var props = this.props;
    
    return (
      <div className='modal-footer' role='footer'>
        <div className='row'>
          <div className='six columns v-margin'>
            <button className='button button-block' onClick={this.props.onClose}>{props.cancelButtonText}</button>
          </div>

          <div className='six columns v-margin'>
            <button className='button button-block button-primary' onClick={this.props.onOk}>{props.okButtonText}</button>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ModalFooter;
