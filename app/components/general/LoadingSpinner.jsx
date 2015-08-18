/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var LoadingSpinner = React.createClass({
  propTypes: {
    message: React.PropTypes.string
  },

  getInitialState: function() {
    return {
      remarks: [
        'In a jiffy',
        'Patience, young grasshopper',
        'Coming right up',
        'One second, please',
        'Give me a moment',
        'Still brewing the coffee',
        'Contemplating new recipes',
        'Cleaning the portafilter'
      ],
      selected: ''
    };
  },

  getRandomRemark: function() {
    var randomIndex = Math.floor(Math.random() * this.state.remarks.length);

    return this.state.remarks[randomIndex];
  },

  componentDidMount: function() {
    // this approach prevents server-client checksum inconsistencies
    this.setState({
      selected: this.props.message || this.getRandomRemark()
    });
  },

  render: function() {
    var props = this.props;

    return (
      <span className='loading-message text-center'>
        <i className='fa fa-spinner fa-pulse loading-icon'></i>
        <div className='witty-remark'>{this.state.selected}</div>
      </span>
    );
  }
});

module.exports = LoadingSpinner;
