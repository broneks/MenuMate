/**
 * @jsx React.DOM
 */

var React      = require('react/addons');
var State      = require('react-router').State;
var Navigation = require('react-router').Navigation;
var Link       = require('react-router').Link;

var api  = require('../utility/api-endpoints');
var util = require('../utility/util');

var queryIdMixin = require('../mixins/queryId');

var LoadingSpinner = require('../components/general/LoadingSpinner.jsx');
var DividingTitle  = require('../components/general/DividingTitle.jsx');


var Done = React.createClass({
  mixins: [queryIdMixin, State, Navigation],

  getInitialState: function() {
    return {
      order:   null,
      loading: true
    };
  },

  routeOnStatus: function(order) {
    var self = this;

    return {
      paid: function() {
        self.setState({
          order: order
        });
      },
      pending: function() {
        self.transitionTo('pending');
      },
      cancelled: function() {
        self.transitionTo('cancelled');
      }
    }[order.status]();
  },

  showChangeDueSection: function() {
    var changeDue = util.asCurrency(this.state.order.change);

    if (this.state.order.change) {
      return (
        <div className='alert-info'>
          <div className='u-pull-left'>
            <span className='field-label'>Change Due:</span>
            <strong>{changeDue}</strong>
          </div>
          <i className='fa fa-money icon-spacing icon-big u-pull-right'></i>
        </div>
      );
    }
  },

  componentDidMount: function() {
    var id = this.getIdParam();

    if (id) {
      this.getById(id, api.orders, function(order) {
        this.setState({
          loading: false
        });

        if (order) {
          this.routeOnStatus(order);
        }
      });
    } else {
      this.transitionTo('pending');
    }
  },

  render: function() {
    var state = this.state;
    var paidOn;

    if (!state.order) {
      if (state.loading) {
        message = <div className='message-center'><LoadingSpinner /></div>;
      } else {
        message = <div className='message-center empty-message'>No order order was found</div>;
      }

      return (
        <div className='message-wrapper'>{message}</div>
      );
    }

    paidOn = util.formatDate(state.order.updated, { time: true });;

    return (
      <div className="done">
        <div className='order-info'>
          <div className='row'>
            <div className='six columns'>
              <div className='order-number'>Order #{state.order._id}</div>
            </div>

            <div className='six columns order-created v-margin'>
              <span className='field-label label-width-auto'>Paid On:</span>
              <span>{paidOn}</span>
            </div>
          </div>
        </div>

        {this.showChangeDueSection()}

        <DividingTitle title="Order Completed" />

        <div clasName='row'>
          <div className='six columns v-margin'>
            <Link to='confirmation' params={{id: this.state.order._id}} className='button button-block'>Review Details</Link>
          </div>

          <div className='six columns v-margin'>
            <Link to='main' className='button button-block button-primary'>Begin a New Order</Link>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Done;
