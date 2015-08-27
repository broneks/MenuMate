/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var APP = require('../../config/app.json');


var StripePayment = React.createClass({
  propTypes: {
    total:     React.PropTypes.number.isRequired,
    onSuccess: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {
      handler: null
    };
  },

  submitPayment: function() {
    var handler = this.state.handler;
    var total   = this.props.total;

    if (handler && total) {
      handler.open({
        name:     'Card Payment',
        email:    APP.email,
        currency: APP.currency,
        amount:   Math.round(total * 100),
        allowRememberMe: false,
      });
    }
  },

  componentDidMount: function() {
    var props   = this.props;
    var handler = this.state.handler = StripeCheckout.configure({
      key:   APP.keys.stripe,
      token: function() {
        props.onSuccess(props.total, 'debit/credit');
      }
    });

    window.addEventListener('popstate', function() {
      handler.close();
    });
  },

  render: function() {
    return (
      <button className='button button-block button-primary' onClick={this.submitPayment}>
        <i className='fa fa-credit-card icon-spacing'></i>
        Debit / Credit
      </button>
    );
  }
});

module.exports = StripePayment;
