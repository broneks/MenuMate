/**
 * @jsx React.DOM
 */

var React   = require('react/addons');
var request = require('superagent');

var api = require('../utility/api-endpoints');

var util = require('../utility/util');

var OrderItem  = require('./OrderItem.jsx');
var OrdersList = require('./OrdersList.jsx');


var PendingOrders = React.createClass({
  getInitialState: function() {
    return {
      orders: []
    };
  },

  getCustomers: function() {
    request
      .get(api.pending)
      .end(function(err, res) {
        if (err) {
          console.log('Error');
          return;
        }

        if (this.isMounted()) {
          this.setState({
            orders: res.body
          });
        }
      }.bind(this));
  },

  componentDidMount: function() {
    this.getCustomers();
  },

  render: function() {
    var orders = this.state.orders;
    var emptyMessageClass = '';
    var links = [];

    if (orders.length) {
      links = orders.map(function(order) {
        var id   = order._id;
        var date = util.formatDate(order.created, { time: true });

        return (
          <OrderItem
            key={id}
            linkTo='checkout'
            linkParams={{ id: id }}
            orderId={id}
            orderDate={date}
            orderItemsLength={order.items.length}
          />
        );
      });
    }

    return (
      <div className='pending-orders'>
        <h4>Pending Orders</h4>

        <OrdersList
          orders={links}
          emptyMessage='no pending orders'
        />
      </div>
    );
  }
});

module.exports = PendingOrders;
