/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var util = require('../utility/util');

var LoadingSpinner = require('./general/LoadingSpinner.jsx');
var DividingTitle  = require('./general/DividingTitle.jsx');


var OrdersInfo = React.createClass({
  propTypes: {
    orders: React.PropTypes.object.isRequired
  },

  render: function() {
    var props = this.props;
    var itemsSold;
    var info;

    if (!props.orders.info) {
      if (props.orders.info === null) {
        info = <div className='text-center text-muted'>. . .</div>
      } else {
        info = <LoadingSpinner message='Loading orders info' />;
      }
    } else {
      itemsSold = props.orders.info.itemsSold;
      itemsSold = util.keys(itemsSold).map(function(name, index) {
        var item = itemsSold[name];

        return (
          <div key={index} title={'ID: ' + item.id}>{util.capitalize(name)}: <span className='u-pull-right'>{item.count}</span></div>
        );
      });

      info = (
        <table className='v-margin'>
          <tbody>
            <tr>
              <td><span className='label'>Number of Orders:</span></td>
              <td>{props.orders.info.quantity}</td>
            </tr>
            <tr>
              <td><span className='label'>Revenue:</span></td>
              <td>{util.asCurrency(props.orders.info.revenue)}</td>
            </tr>
            <tr>
              <td><span className='label'>Average Payment:</span></td>
              <td>{util.asCurrency(props.orders.info.averagePayment)}</td>
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
        <DividingTitle title='Order Info' dashed={true} />

        {info}
      </div>
    );
  }
});

module.exports = OrdersInfo;
