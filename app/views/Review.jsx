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
var CustomerInfo    = require('../components/CustomerInfo.jsx');


var Review = React.createClass({
  getInitialState: function() {
    return {
      review: {
        orders: null
      },
      dateRange: {
        from: null,
        to:   null
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

  buildDateString: function(date) {
    return util.keys(date).map(function(key) {
      return date[key];
    }, this).join('-');
  },

  getOrdersReviewByRange: function() {
    var dateFrom   = this.buildDateString(this.state.dateRange.from);
    var dateTo     = this.buildDateString(this.state.dateRange.to);
    var dateParams = dateFrom + '/' + dateTo;

    request
      .get(api.review.orders.dateRange + dateParams)
      .end(function(err, res) {
        if (err) {
          console.log(err);
          return;
        }

        var updated;

        if (res.body.message) {
          this.props.APP.flashMessage.show('info', res.body.message);

          updated = React.addons.update(this.state.review, {
            orders: {
              info: {$set: null}
            }
          });
        } else {
          this.props.APP.flashMessage.hide();

          updated = React.addons.update(this.state.review, {
            orders: {
              info: {$set: res.body}
            }
          });
        }

        this.setState({
          review: updated
        });
      }.bind(this));
  },

  updateDateRange: function(from, to) {
    var updated = {
      dateRange: {
        from: from,
        to:   to
      }
    };

    this.setState(updated, this.getOrdersReviewByRange);
  },

  componentDidMount: function() {
    this.getOrdersGeneralReview();
  },

  render: function() {
    var state = this.state;
    var message;

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
      <div className='review'>
        <SelectDateRange onChange={this.updateDateRange} yearsRange={state.review.orders.general.years} />

        <OrdersInfo orders={state.review.orders} />

        <CustomerInfo orders={state.review.orders} />
      </div>
    );
  }
});

module.exports = Review;
