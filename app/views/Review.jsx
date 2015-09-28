/**
 * @jsx React.DOM
 */

var React   = require('react/addons');
var request = require('superagent');

var api  = require('../utility/api-endpoints');
var util = require('../utility/util');

var LoadingSpinner  = require('../components/general/LoadingSpinner.jsx');
var SelectDateRange = require('../components/general/SelectDateRange.jsx');
var OrdersInfo      = require('../components/OrdersInfo.jsx');
var TrafficInfo     = require('../components/TrafficInfo.jsx');


var Review = React.createClass({
  getInitialState: function() {
    return {
      general: null,
      dateRange: {
        from: null,
        to:   null
      },
      dateString: '',
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
            general: res.body,
            loading: false
          });
        }
      }.bind(this));
  },

  buildDateString: function(date) {
    return util.keys(date).map(function(key) {
      return date[key];
    }, this).join('-');
  },

  updateDateRange: function(from, to) {
    var dateString = this.buildDateString(from) + '/' + this.buildDateString(to);

    this.setState({
      dateRange: {
        from: from,
        to:   to
      },
      dateString: dateString
    });
  },

  componentDidMount: function() {
    this.getOrdersGeneralReview();
  },

  render: function() {
    var state = this.state;
    var message;

    if (!state.general) {
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
      <div className='review'>
        <SelectDateRange onChange={this.updateDateRange} yearsRange={state.general.years} />

        <OrdersInfo dateString={state.dateString} />

        <TrafficInfo dateString={state.dateString} />
      </div>
    );
  }
});

module.exports = Review;
