/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var api = require('../utility/api-endpoints');

var Orders = require('../components/Orders.jsx');


var Paid = React.createClass({
  render: function() {
    return (
      <Orders
        apiUrl={api.paid}
        status='paid'
        linkTo='confirmation'
      />
    );
  }
});

module.exports = Paid;
