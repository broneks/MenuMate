/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var APP = require('../../config/app.json');

var LoadingSpinner = require('./general/LoadingSpinner.jsx');
var DividingTitle  = require('./general/DividingTitle.jsx');
var MarkerMap      = require('./general/MarkerMap.jsx');
var SendEmail      = require('./general/SendEmail.jsx');


var CustomerInfo = React.createClass({
  propTypes: {
    orders: React.PropTypes.object.isRequired
  },

  customerInfoIsEmpty: function() {
    var info = this.props.orders.info;

    return info && (!info.customerInfo || !info.customerInfo.length);
  },

  render: function() {
    var props = this.props;
    var noCustomerInfo = this.customerInfoIsEmpty();
    var list;
    var info;

    if (!props.orders.info || noCustomerInfo) {
      if (props.orders.info === null || noCustomerInfo) {
        info = <div className='text-center text-muted'>. . .</div>
      } else {
        info = <LoadingSpinner message='Loading customer info' />;
      }
    } else {
      list = props.orders.info.customerInfo.map(function(customer, index) {
        var pcode = customer.postal ? <a className='postal-link'>{customer.postal}</a> : <span className='text-muted'>no postal</span>;
        var email = customer.email || <span className='text-muted'>no email</span>;

        return (
          <li key={index} className='row'>
            <div className='columns six'>{pcode}</div>
            <div className='columns six'>{email}</div>
          </li>
        );
      }, this);

      var emailList = props.orders.info.customerInfo
        .filter(function(customer) {
          return customer.email.length;
        })
        .map(function(customer) {
          return customer.email;
        });

      info = (
        <div className='row postal-and-email-info'>
          <div className='columns six v-margin'>
            <ul className='postal-email-list'>
              {list}
            </ul>

            <SendEmail list={emailList} buttonBlock={true} />
          </div>

          <div className='columns six v-margin'>
            <MarkerMap data={props.orders.info.customerInfo} dataItem='postal' center={APP.coords} />
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
