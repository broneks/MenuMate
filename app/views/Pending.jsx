/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var PendingOrders = require('../components/PendingOrders.jsx');


var Pending = React.createClass({
  render: function() {
    return (
      <PendingOrders />
    );
  }
});

module.exports = Pending;
