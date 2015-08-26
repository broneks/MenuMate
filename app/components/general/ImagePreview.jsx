/**
 * @jsx React.DOM
 */

var React = require('react/addons');


var ImagePreview = React.createClass({
  propTypes: {
    src: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      src: ''
    };
  },

  getInitialState: function() {
    return {
      src:    this.props.src,
      reader: null
    };
  },

  isImage: function(file) {
    if (file && file.type) {
      return /image\//.test(file.type);
    }
    return false;
  },

  setSrc: function(file) {
    if (file && this.isImage(file)) {
      this.state.reader.onloadend = function(e) {
        this.setState({
          src: e.target.result
        });
      }.bind(this);

      this.state.reader.readAsDataURL(file);
    } else {
      this.clearSrc();
    }
  },

  clearSrc: function() {
    this.setState({
      src: ''
    });
  },

  componentDidMount: function() {
    this.setState({
      reader: new FileReader()
    });
  },

  render: function() {
    return (
      <div className='image-preview-wrapper'>
        <img id='image-preview' src={this.state.src} />
        <span className='no-image-message message-center text-muted'>Image Preview</span>
      </div>
    );
  }
});

module.exports = ImagePreview;
