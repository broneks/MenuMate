/**
 * @jsx React.DOM
 */

var React = require('react/addons');
var State = require('react-router').State;


var Checkout = React.createClass({
  mixins: [State],

  render: function() {
    var id = this.getParams().id;

    var withParam = id ? 'for customer number ' + id : '';

    return (
      <div>this is the checkout page {withParam}</div>
    );
  }
});

module.exports = Checkout;
