/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var APP = require('../../config/app.json');

var LoadingSpinner = require('./general/LoadingSpinner.jsx');
var DividingTitle  = require('./general/DividingTitle.jsx');
var MarkerMap      = require('./general/MarkerMap.jsx');


var CustomerInfo = React.createClass({
  propTypes: {
    orders: React.PropTypes.object.isRequired
  },

  render: function() {
    var props = this.props;

    // if (!props.orders.info || noCustomerInfo) {
    //   if (props.orders.info === null || noCustomerInfo) {
    //     info = <div className='text-center text-muted'>. . .</div>
    //   } else {
    //     info = <LoadingSpinner message='Loading customer info' />;
    //   }
    // } else {
    //   list = props.orders.info.customerInfo.map(function(customer, index) {
    //     var pcode = customer.postal ? <a className='postal-link'>{customer.postal}</a> : <span className='text-muted'>no postal</span>;
    //     var email = customer.email || <span className='text-muted'>no email</span>;
    //
    //     return (
    //       <li key={index} className='row'>
    //         <div className='columns six'>{pcode}</div>
    //         <div className='columns six'>{email}</div>
    //       </li>
    //     );
    //   }, this);
    //
    //   var emailList = props.orders.info.customerInfo
    //     .filter(function(customer) {
    //       return customer.email.length;
    //     })
    //     .map(function(customer) {
    //       return customer.email;
    //     });
    //
    //   info = (
    //     <div className='row postal-and-email-info'>
    //       <div className='columns six v-margin'>
    //         <ul className='postal-email-list'>
    //           {list}
    //         </ul>
    //
    //         <SendEmail list={emailList} buttonBlock={true} />
    //       </div>
    //
    //       <div className='columns six v-margin'>
    //
    //       </div>
    //     </div>
    //   );
    // }

    return (
      <div className='loyalty-review v-double-margin'>
        <DividingTitle title='Loyalty Info' dashed={true} />

        loyalty info
      </div>
    );
  }
});

// <MarkerMap data={props.orders.info.customerInfo} dataItem='postal' center={APP.coords} />

module.exports = CustomerInfo;
