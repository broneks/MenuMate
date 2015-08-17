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
        orders: null,
        loading: true
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
    return Object.keys(date).map(function(key) {
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

          this.setState({
            review: updated
          });
        } else {
          this.props.APP.flashMessage.hide();

          updated = React.addons.update(this.state.review, {
            orders: {
              info: {$set: res.body}
            }
          });

          this.setState({
            review: updated
          });
        }
      }.bind(this));
  },

  showOrdersInfo: function() {
    var state = this.state;
    var ordersInfo;
    var itemsSold;
    var info;

    if (!state.review.orders.info) {
      if (state.review.loading) {
        info = <LoadingSpinner />;
      }
    } else {
      ordersInfo = this.state.review.orders.info;

      itemsSold = Object.keys(ordersInfo.itemsSold).map(function(name, index) {
        var item = ordersInfo.itemsSold[name];

        return (
          <div key={index} title={'ID: ' + item.id}>{util.capitalize(name)}: <span className='u-pull-right'>{item.count}</span></div>
        );
      });

      info = (
        <table>
          <tbody>
            <tr>
              <td>Quantity:</td>
              <td>{ordersInfo.quantity}</td>
            </tr>
            <tr>
              <td>Revenue:</td>
              <td>{util.asCurrency(ordersInfo.revenue)}</td>
            </tr>
            <tr>
              <td>Average Payment:</td>
              <td>{util.asCurrency(ordersInfo.averagePayment)}</td>
            </tr>

            <tr>
              <td>Items Sold:</td>
              <td>{itemsSold}</td>
            </tr>
          </tbody>
        </table>
      );
    }

    return info;
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

        <div className='order-review v-double-margin'>
          {this.showOrdersInfo()}
        </div>
      </div>
    );
  }
});

module.exports = Review;
