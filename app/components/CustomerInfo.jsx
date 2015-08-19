/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var util = require('../utility/util');

var LoadingSpinner = require('./general/LoadingSpinner.jsx');
var DividingTitle  = require('./general/DividingTitle.jsx');
var MarkerMap      = require('./general/MarkerMap.jsx');


var CustomerInfo = React.createClass({
  propTypes: {
    orders: React.PropTypes.object.isRequired
  },

  render: function() {
    var props = this.props;
    var postal;
    var info;

    if (!props.orders.info) {
      if (props.orders.info === null) {
        info = <div className='text-center text-muted'>. . .</div>
      } else {
        info = <LoadingSpinner message='Loading customer info' />;
      }
    } else {
      postal = props.orders.info.customerInfo.map(function(customer, index) {
        var pcode = customer.postal ? <a className='postal-link'>{customer.postal}</a> : <span className='text-muted'>no postal</span>;
        var email = customer.email || <span className='text-muted'>no email</span>;

        return (
          <li key={index} className='row'>
            <div className='columns six'>{pcode}</div>
            <div className='columns six'>{email}</div>
          </li>
        );
      }, this);

      info = (
        <div className='row postal-and-email-info'>
          <div className='columns six v-margin'>
            <ul className='postal-email-list'>
              {postal}
            </ul>
          </div>

          <div className='columns six v-margin'>
            <MarkerMap data={props.orders.info.customerInfo} dataItem='postal' center={util.MAP_CENTER} />
          </div>
        </div>
      );
    }

    return (
      <div className='customer-review v-double-margin'>
        <DividingTitle title='Customer Info' dashed={true} />

        {info}
      </div>
    );
  }
});

module.exports = CustomerInfo;
