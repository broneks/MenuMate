/**
 * @jsx React.DOM
 */

var React = require('react/addons');


var ModalBody = React.createClass({
  render: function() {
    var children = React.Children.map(this.props.children, function(child) {
      return child;
    }, this);

    return (
      <div className='modal-body' role='document'>
        {children}
      </div>
    );
  }
});

module.exports = ModalBody;
