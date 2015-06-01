/**
 * @jsx React.DOM
 */

var React = require('react/addons');
var State = require('react-router').State;

var PendingCustomers = require('../components/PendingCustomers.jsx');


var Checkout = React.createClass({
  mixins: [State],

  getId: function() {
    var id    = this.getParams().id;
    var isInt = /^\d+$/g.test(id);

    if (isInt) return id;

    return false;
  },

  render: function() {
    var id = this.getId();

    if (id) {
      return (
        <div>Customer Number {id}</div>
      );
    }

    return (
      <PendingCustomers />
    );
  }
});

module.exports = Checkout;
