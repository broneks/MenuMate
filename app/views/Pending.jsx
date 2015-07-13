/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var api = require('../utility/api-endpoints');

var Orders = require('../components/Orders.jsx');


var Pending = React.createClass({
  render: function() {
    return (
      <Orders
        apiUrl={api.pending}
        status='pending'
      />
    );
  }
});

module.exports = Pending;
