/**
 * @jsx React.DOM
 */

var React      = require('react/addons');
var State      = require('react-router').State;
var Navigation = require('react-router').Navigation;

var api  = require('../utility/api-endpoints');
var util = require('../utility/util');

var queryIdMixin = require('../mixins/queryId');

var LoadingSpinner = require('../components/general/LoadingSpinner.jsx');


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
          order:   order,
          loading: false
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

  componentDidMount: function() {
    var id = this.getIdParam();

    if (id) {
      this.getById(id, api.orders, function(order) {
        if (order) {
          this.routeOnStatus(order);
        } else {
          this.transitionTo('main');
        }
      });
    } else {
      this.transitionTo('pending');
    }
  },

  render: function() {
    var state = this.state;

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

    console.log(state.order);

    return (
      <div>done</div>
    );
  }
});

module.exports = Done;
