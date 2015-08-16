/**
 * @jsx React.DOM
 */

var React   = require('react/addons');
var request = require('superagent');

var api  = require('../utility/api-endpoints');
var util = require('../utility/util');

var LoadingSpinner  = require('../components/general/LoadingSpinner.jsx');
var SelectDateRange = require('../components/general/SelectDateRange.jsx');


var Review = React.createClass({
  getInitialState: function() {
    return {
      review: {
        orders: null
      },
      loading: true
    };
  },

  getOrdersGeneralReview: function() {
    request
      .get(api.review.orders.general)
      .end(function(err, res) {
        if (err) {
          console.log(err);
          return;
        }

        if (this.isMounted()) {
          this.setState({
            review: {
              orders: {
                general: res.body
              }
            },
            loading: false
          });
        }
      }.bind(this));
  },

  getOrdersReviewByRange: function() {
    // TODO
  },

  componentDidMount: function() {
    this.getOrdersGeneralReview();
    // this.getOrdersReviewByRange();
  },

  render: function() {
    var state = this.state;

    if (!state.review.orders) {
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
      <div>
        <SelectDateRange yearsRange={state.review.orders.general.years} />
      </div>
    );
  }
});

module.exports = Review;
