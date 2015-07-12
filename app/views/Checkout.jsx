/**
 * @jsx React.DOM
 */

var React      = require('react/addons');
var request    = require('superagent');
var State      = require('react-router').State;
var Navigation = require('react-router').Navigation;

var api = require('../utility/api-endpoints');
var util = require('../utility/util');

var Basket = require('../components/Basket.jsx');
var Modal  = require('../components/Modal.jsx');
var CashCalculator = require('../components/CashCalculator.jsx');


var Checkout = React.createClass({
  mixins: [State, Navigation],

  getInitialState: function() {
    return {
      order: null
    };
  },

  getId: function() {
    var id    = this.getParams().id;
    var isInt = /^\d+$/g.test(id);

    if (isInt) {
      return id;
    } else {
      this.transitionTo('pending');
    }
  },

  getOrderById: function(id, callback) {
    request
      .get(api.orders + id)
      .end(function(err, res) {
        if (err) {
          console.log('Error');
          return;
        }

        if (this.isMounted()) {
          this.setState({
            order: res.body
          });
        }
      }.bind(this));
  },

  submitPayment: function(payment) {
    // TODO: calculate change back

    alert('submit payment');
  },

  componentDidMount: function() {
    var id = this.getId();

    if (id) {
      this.getOrderById(id);
    }
  },

  render: function() {
    var state = this.state;
    var status;
    var created;

    if (state.order) {
      statusClass = ' is-' + state.order.status;
      status  = util.capitalize(state.order.status);
      created = util.formatDate(state.order.created, { time: true });

      return (
        <div className={'checkout' + statusClass}>
          <div className='order-info'>
            <div className='order-number'>Order #{state.order._id}</div>

            <div className='row'>
              <div className='six columns order-created v-margin'>Created: {created}</div>
              <div className='six columns order-status v-margin text-center'>{status}</div>
            </div>
          </div>

          <Basket
            order={state.order}
            renderStaticItems={true}
          />

          <div className='dividing-title-dashed'>
            <hr role='separator' aria-hidden='true' />
            <div className='title'>Payment</div>
          </div>

          <div className='payment-wrapper'>

            <div className='payment-info v-margin'>

              <div className='row'>
                <div className='six columns payment-cash v-margin'>
                  <Modal
                    buttonText='Cash'
                    buttonBlock={true}
                    buttonIcon='fa fa-money icon-spacing'
                    modalTitle='Cash Payment'
                    modalBody={<CashCalculator onDone={this.submitPayment} />}
                  />
                </div>

                <div className='six columns payment-card v-margin'>
                  <button className='button button-block' onClick={this.submitPayment}>
                    <i className='fa fa-credit-card icon-spacing'></i>
                    Debit / Credit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

      /*
      <div className='customer-info v-margin'>
        <div className='row'>
          <div className='six columns customer-postal v-margin'>
            <input type='text' ref='postal' placeholder='postal code' />
          </div>

          <div className='six columns customer-email v-margin'>
            <input type='text' ref='email' placeholder='email' />
          </div>
        </div>
      </div>
      */
    }

    return (
      <div className='text-center'>No order order was found</div>
    );
  }
});

module.exports = Checkout;
