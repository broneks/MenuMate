/**
 * @jsx React.DOM
 */

var React = require('react/addons');


var StripePayment = React.createClass({
  propTypes: {
    total:     React.PropTypes.number.isRequired,
    onSuccess: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {
      key:     'pk_test_wyIFxCYoLMsbK7KX9Fzjaieb',
      email:   'messenger@mailbolt.com',
      handler: null
    };
  },

  submitPayment: function() {
    var handler = this.state.handler;
    var total   = this.props.total;

    if (handler && total) {
      handler.open({
        name:     'Card Payment',
        email:    this.state.email,
        amount:   Math.round(total * 100),
        currency: 'cad',
        allowRememberMe: false,
      });
    }
  },

  componentDidMount: function() {
    var props   = this.props;
    var handler = this.state.handler = StripeCheckout.configure({
      key:   this.state.key,
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
      <button className='button button-block' onClick={this.submitPayment}>
        <i className='fa fa-credit-card icon-spacing'></i>
        Debit / Credit
      </button>
    );
  }
});

module.exports = StripePayment;
