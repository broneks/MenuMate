/**
 * @jsx React.DOM
 */

var React = require('react/addons');


var NotFound = React.createClass({
  render: function() {

    return (
      <div className='page-not-found text-center'>
        <h1>404</h1>
        <p>Page Not Found</p>
        <img src="/img/coffee-beans.gif" alt="" />
      </div>
    );
  }
});

module.exports = NotFound;
