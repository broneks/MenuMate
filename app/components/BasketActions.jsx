/**
 * @jsx React.DOM
 */

var React      = require('react/addons');
var request    = require('superagent');
var Navigation = require('react-router').Navigation;

var api = require('../utility/api-endpoints');

var util = require('../utility/util');

var Modal  = require('./general/Modal.jsx');


var BasketActions = React.createClass({
  propTypes: {
    items:       React.PropTypes.array.isRequired,
    quantities:  React.PropTypes.array.isRequired,
    total:       React.PropTypes.number.isRequired,
    clearBasket: React.PropTypes.func.isRequired
  },

  mixins: [Navigation],

  checkout: function() {
    var props = this.props;
    var order = {};

    if (!this.props.items.length) return;

    order.items = props.items.map(function(item) {
      return item._id;
    });
    order.quantities = props.quantities;
    order.total = props.total;

    request
      .post(api.orders)
      .send(order)
      .set('Accept', 'application/json')
      .end(function(err, res) {
        if (err) {
          console.log(err);
          return;
        }

        var response = JSON.parse(res.text);

        this.transitionTo('checkout', { id: response.context.id });
      }.bind(this));
  },

  clearBasket: function() {
    if (this.props.items.length) {
      this.props.clearBasket();
    }

    this.refs.cancelModal.close();
  },

  render: function() {
    return (
      <div className='basket-actions'>
        <div className='row'>
          <div className='three columns v-margin'>
            <Modal
              ref='cancelModal'
              disabled={!this.props.items.length}
              buttonText='Cancel'
              buttonBlock={true}
              body={<div className='cancel-order-message'>Cancel the current order?</div>}
              onOk={this.clearBasket}
              okButtonText='Yes'
              cancelButtonText='No'
            />
          </div>

          <div className='five columns v-margin'>
            <button className='button button-block button-primary' onClick={this.checkout}>Checkout</button>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = BasketActions;
