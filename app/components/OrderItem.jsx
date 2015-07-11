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
    orderItemsLength: React.PropTypes.number.isRequired
  },

  render: function() {
    var props = this.props;

    return (
      <li className='order-item'>
        <Link to={props.linkTo} params={props.linkParams} className='row'>
          <div className='four columns'>Order #{props.orderId}</div>
          <div className='five columns'>{props.orderDate}</div>
          <div className='three columns'>Items: {props.orderItemsLength}</div>
        </Link>
      </li>
    );
  }
});

module.exports = OrderItem;
