/**
 * @jsx React.DOM
 */

var React = require('react/addons');


var ImagePreview = React.createClass({
  render: function() {
    return (
      <div className='image-preview-wrapper'>
        <img id='image-preview' src='' />
        <span className='no-image-message message-center text-muted'>Image Preview</span>
      </div>
    );
  }
});

module.exports = ImagePreview;
