/**
 * @jsx React.DOM
 */

var React = require('react/addons');


var NotFound = React.createClass({
  render: function() {

    return (
      <div>
        <h1>404</h1>
        <p>Page Not Found</p>
      </div>
    );
  }
});

module.exports = NotFound;
