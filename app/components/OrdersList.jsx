/**
 * @jsx React.DOM
 */

var React = require('react/addons');


var OrdersList = React.createClass({
  propTypes: {
    orders:       React.PropTypes.array.isRequired,
    emptyMessage: React.PropTypes.string.isRequired
  },

  render: function() {
    var props = this.props;
    var orders = props.orders;
    var emptyMessageClass = '';

    if (!orders.length) {
      orders = <li className='empty-message'>{props.emptyMessage}</li>;
      emptyMessageClass = ' is-empty';
    }

    return (
      <ul className={'orders-list list-unstyled' + emptyMessageClass}>
        {orders}
      </ul>
    );
  }
});

module.exports = OrdersList;
