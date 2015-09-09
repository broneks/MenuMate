/**
 * @jsx React.DOM
 */

var React   = require('react/addons');
var request = require('superagent');

var api  = require('../utility/api-endpoints');
var util = require('../utility/util');

var LoadingSpinner = require('./general/LoadingSpinner.jsx');
var DividingTitle  = require('./general/DividingTitle.jsx');


var OrdersInfo = React.createClass({
  propTypes: {
    dateString: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
      orders:  null,
      loading: true
    };
  },

  getOrdersByDateRange: function(props) {
    request
      .get(api.review.orders.dateRange + props.dateString)
      .end(function(err, res) {
        if (err) {
          console.log(err);
          return;
        }

        var orders;

        if (res.body.message) {
          orders = null;
        } else {
          orders = res.body;
        }

        this.setState({
          orders:  orders,
          loading: false
        });
      }.bind(this));
  },

  componentWillReceiveProps: function(nextProps) {
    this.getOrdersByDateRange(nextProps);
  },

  render: function() {
    var state = this.state;
    var itemsSold;
    var info;

    if (!state.orders) {
      if (state.orders == null) {
        info = <div className='text-center text-muted'>. . .</div>
      } else {
        info = <LoadingSpinner message='Loading orders info' />;
      }
    } else {
      itemsSold = state.orders.itemsSold;
      itemsSold = itemsSold.map(function(item, index) {
        var bold = index === 0 ? 'text-bold' : '';

        return (
          <div key={index} title={'ID: ' + item.id} className={bold}>{util.capitalize(item.name)}: <span className='u-pull-right'>{item.count}</span></div>
        );
      });

      info = (
        <table className='v-margin'>
          <tbody>
            <tr>
              <td><span className='label'>Number of Orders:</span></td>
              <td>{state.orders.quantity}</td>
            </tr>
            <tr>
              <td><span className='label'>Revenue:</span></td>
              <td>{util.asCurrency(state.orders.revenue)}</td>
            </tr>
            <tr>
              <td><span className='label'>Average Payment:</span></td>
              <td>{util.asCurrency(state.orders.averagePayment)}</td>
            </tr>

            <tr>
              <td><span className='label'>Menu Items Sold:</span></td>
              <td>{itemsSold}</td>
            </tr>
          </tbody>
        </table>
      );
    }

    return (
      <div className='order-review'>
        <DividingTitle title='Orders Info' dashed={true} />

        {info}
      </div>
    );
  }
});

module.exports = OrdersInfo;
