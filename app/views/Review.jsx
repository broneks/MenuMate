/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var api  = require('../utility/api-endpoints');
var util = require('../utility/util');

var LoadingSpinner = require('../components/general/LoadingSpinner.jsx');


var Review = React.createClass({
  getInitialState: function() {
    return {
      result:  null,
      loading: true
    };
  },

  componentDidMount: function() {

  },

  render: function() {
    var state = this.state;

    if (!state.result) {
      if (state.loading) {
        message = <div className='message-center'><LoadingSpinner /></div>;
      } else {
        message = <div className='message-center empty-message'>No results were retrieved</div>;
      }

      return (
        <div className='message-wrapper'>{message}</div>
      );
    }

    return (
      <div>review</div>
    );
  }
});

module.exports = Review;
