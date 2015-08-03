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
var LoadingSpinner = require('../components/LoadingSpinner.jsx');
var CashCalculator = require('../components/CashCalculator.jsx');
var DividingTitle  = require('../components/DividingTitle.jsx');


var Checkout = React.createClass({
  mixins: [State, Navigation],

  getInitialState: function() {
    return {
      order:   null,
      loading: true
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
          console.log(err);
          return;
        }

        if (this.isMounted()) {
          this.setState({
            order:   res.body,
            loading: false
          });
        }
      }.bind(this));
  },

  submitPayment: function(payment, paymentMethod) {
    var refs   = this.refs;
    var method = paymentMethod || 'cash';
    var total  = this.state.order.total * util.TAX;
    var checkoutDetails;

    if (payment) {
      if (payment < total) {
        refs.cashCalculator.showError('Payment cannot be less than the total price');
      } else {
        refs.cashCalculator.clearError();

        checkoutDetails = {
          method  : method,
          status  : 'paid',
          payment : payment,
          change  : payment - total
        };

        util.addInputsToObj(checkoutDetails, refs);

        request
          .put(api.orders + this.getId())
          .send(checkoutDetails)
          .set('Accept', 'application/json')
          .end(function(err, res) {
            if (err) {
              this.refs.cashModal.close();

              if (err.status === 422) {
                this.props.APP.flashMessage.show('error', res.body.errors);
              } else {
                console.log(err);
              }
              return;
            }

            this.transitionTo('done', { id: this.getId() });
          }.bind(this));
      }
    }
  },

  showCustomerInfo: function() {
    var state = this.state;
    var postal;
    var email;

    if (state.order.status === 'paid') {
      if (state.order.postal || state.order.email) {
        postal = state.order.postal ? (
          <div className='six columns customer-postal v-margin'>
            <span className='field-label'>Postal Code:</span>
            <span>{state.order.postal}</span>
          </div>
        ) : null;

        email = state.order.email ? (
          <div className='six columns customer-email v-margin'>
            <span className='field-label'>Email:</span>
            <span>{state.order.email}</span>
          </div>
        ) : null;

        return (
          <div>
            <DividingTitle dashed={true} title='Customer Info' />

            <div className='customer-info v-margin'>
              <div className='row'>
                {postal}
                {email}
              </div>
            </div>
          </div>
        );
      }

      return;
    }

    return (
      <div>
        <DividingTitle dashed={true} title='Customer Info' />

        <div className='customer-info v-margin'>
          <div className='row'>
            <div className='six columns customer-postal v-margin'>
              <input type='text' ref='input_postal' name='postal' placeholder='postal code' maxLength='6' onBlur={this.uppercase.bind(null, 'input_postal')} />
            </div>

            <div className='six columns customer-email v-margin'>
              <input type='text' ref='input_email' name='email' placeholder='email' />
            </div>
          </div>
        </div>
      </div>
    );
  },

  showPaymentSection: function() {
    var state = this.state;

    if (state.order.status === 'paid') {
      return (
        <div className='payment-wrapper'>
          <div className='field-group'>
            <span className='field-label'>Paid On:</span>
            <span>{util.formatDate(state.order.updated, { time: true })}</span>
          </div>

          <div className='field-group'>
            <span className='field-label'>Method:</span>
            <span>{util.capitalize(state.order.method)}</span>
          </div>

          <div className='field-group'>
            <span className='field-label'>Payment:</span>
            <span>{util.asCurrency(state.order.payment)}</span>
          </div>

          <div className='field-group'>
            <span className='field-label'>Change:</span>
            <span>{util.asCurrency(state.order.change)}</span>
          </div>
        </div>
      );
    }

    return (
      <div className='payment-wrapper'>
        <div className='payment-info v-margin'>

          <div className='row'>
            <div className='six columns payment-cash v-margin'>
              <Modal
                ref='cashModal'
                buttonText='Cash'
                buttonBlock={true}
                buttonIcon='fa fa-money icon-spacing'
                onClose={this.onCashModalClose}
                modalTitle='Cash Payment'
                modalBody={
                  <CashCalculator
                    ref='cashCalculator'
                    onCancel={this.cancelCashPayment}
                    onSubmit={this.submitPayment}
                  />
                }
              />
            </div>

            <div className='six columns payment-card v-margin'>
              <button className='button button-block' onClick={this.submitPayment.bind(null, this.state.order.total * util.TAX, 'debit/credit')}>
                <i className='fa fa-credit-card icon-spacing'></i>
                Debit / Credit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },

  cancelCashPayment: function() {
    this.refs.cashModal.close();
  },

  onCashModalClose: function() {
    this.refs.cashCalculator.clearDisplay();
  },

  uppercase: function(ref) {
    var node = this.refs[ref].getDOMNode();

    node.value = util.uppercase(node.value);
  },

  componentDidMount: function() {
    var id = this.getId();

    if (id) {
      this.getOrderById(id);
    }
  },

  render: function() {
    var state = this.state;
    var message;
    var statusClass;
    var status;
    var created;
    var total;

    if (!state.order) {
      if (state.loading) {
        message = <div className='message-center'><LoadingSpinner /></div>;
      } else {
        message = <div className='message-center empty-message'>No order order was found</div>;
      }

      return (
        <div className='message-wrapper'>{message}</div>
      );
    }

    statusClass = ' is-' + state.order.status;
    status  = util.capitalize(state.order.status);
    created = util.formatDate(state.order.created, { time: true });

    return (
      <div className={'checkout' + statusClass}>
        <div className='order-info'>
          <div className='order-number'>Order #{state.order._id}</div>

          <div className='row'>
            <div className='six columns order-created v-margin'>
              <span className='field-label label-width-auto'>Created:</span>
              <span>{created}</span>
            </div>

            <div className='six columns order-status v-margin text-center'>{status}</div>
          </div>
        </div>

        <Basket
          order={state.order}
          renderStaticItems={true}
        />

        {this.showCustomerInfo()}

        <DividingTitle dashed={true} title='Payment' />

        {this.showPaymentSection()}
      </div>
    );
  }
});

module.exports = Checkout;
