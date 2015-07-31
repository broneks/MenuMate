/**
 * @jsx React.DOM
 */

var React = require('react/addons');
var Link  = require('react-router').Link;


var OrderItem = React.createClass({
  propTypes: {
    linkTo:     React.PropTypes.string.isRequired,
    linkParams: React.PropTypes.object.isRequired,
    orderId:    React.PropTypes.number.isRequired,
    orderDate:  React.PropTypes.string.isRequired,
    orderItemsQuantity: React.PropTypes.number.isRequired
  },

  render: function() {
    var props = this.props;

    return (
      <li className='order-item'>
        <Link to={props.linkTo} params={props.linkParams} className='row'>
          <div className='four columns order-id'>Order #{props.orderId}</div>
          <div className='five columns order-date'>{props.orderDate}</div>
          <div className='three columns items-total'>Items: {props.orderItemsQuantity}</div>
        </Link>
      </li>
    );
  }
});

module.exports = OrderItem;
