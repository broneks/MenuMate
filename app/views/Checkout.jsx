/**
 * @jsx React.DOM
 */

var React      = require('react/addons');
var request    = require('superagent');
var State      = require('react-router').State;
var Navigation = require('react-router').Navigation;

var Basket = require('../components/Basket.jsx');

var api = require('../utility/api-endpoints');
var util = require('../utility/util');


var Checkout = React.createClass({
  mixins: [State, Navigation],

  getInitialState: function() {
    return {
      order: null
    };
  },

  getId: function() {
    var id    = this.getParams().id;
    var isInt = /^\d+$/g.test(id);

    if (isInt) {
      return id;
    } else {
      this.transitionTo('pending');
    }
  },

  getOrderById: function(id, callback) {
    request
      .get(api.orders + id)
      .end(function(err, res) {
        if (err) {
          console.log('Error');
          return;
        }

        if (this.isMounted()) {
          this.setState({
            order: res.body
          });
        }
      }.bind(this));
  },

  componentDidMount: function() {
    var id = this.getId();

    if (id) {
      this.getOrderById(id);
    }
  },

  render: function() {
    var state = this.state;
    var status;
    var created;

    if (state.order) {
      statusClass = ' is-' + state.order.status;
      status  = util.capitalize(state.order.status);
      created = util.formatDate(state.order.created, { time: true });

      return (
        <div className={'checkout' + statusClass}>
          <div className='order-info'>
            <div className='order-number'>Order #{state.order._id}</div>

            <div className='row'>
              <div className='six columns order-created v-margin'>Created: {created}</div>
              <div className='six columns order-status v-margin text-center'>{status}</div>
            </div>
          </div>

          <Basket
            order={state.order}
            renderStaticItems={true}
          />

        </div>
        // TODO: add more info
      );
    }

    return (
      <div className='text-center'>No order order was found</div>
    );
  }
});

module.exports = Checkout;
