/**
 * @jsx React.DOM
 */

var React   = require('react/addons');
var request = require('superagent');

var util = require('../utility/util');

var OrderItem  = require('./OrderItem.jsx');
var OrdersList = require('./OrdersList.jsx');


var Orders = React.createClass({
  propTypes: {
    apiUrl: React.PropTypes.string.isRequired,
    status: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
      orders:  [],
      loading: true
    };
  },

  getOrders: function() {
    request
      .get(this.props.apiUrl)
      .end(function(err, res) {
        if (err) {
          console.log('Error');
          return;
        }

        if (this.isMounted()) {
          this.setState({
            orders:  res.body,
            loading: false
          });
        }
      }.bind(this));
  },

  componentDidMount: function() {
    this.getOrders();
  },

  render: function() {
    var orders = this.state.orders;
    var status = this.props.status.toLowerCase();
    var listItems = [];

    if (orders.length) {
      listItems = orders.map(function(order) {
        var id       = order._id;
        var date     = util.formatDate(order.created, { time: true });
        var quantity = order.quantities.reduce(function(a, b) { return a + b });

        return (
          <OrderItem
            key={id}
            linkTo='checkout'
            linkParams={{ id: id }}
            orderId={id}
            orderDate={date}
            orderItemsQuantity={quantity}
          />
        );
      });
    }

    return (
      <div className={status + '-orders'}>
        <h4>{util.capitalize(status)} Orders</h4>

        <OrdersList
          orders={listItems}
          loading={this.state.loading}
          emptyMessage={'No ' + status + ' orders'}
        />
      </div>
    );
  }
});

module.exports = Orders;
