/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var PendingCustomers = require('../components/PendingCustomers.jsx');


var Pending = React.createClass({
  render: function() {
    return (
      <PendingCustomers />
    );
  }
});

module.exports = Pending;
