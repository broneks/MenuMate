/**
 * @jsx React.DOM
 */

var React      = require('react/addons');
var request    = require('superagent');
var Navigation = require('react-router').Navigation;

var api = require('../utility/api-endpoints');
var util = require('../utility/util');

var queryIdMixin = require('../mixins/queryId');

var Basket         = require('../components/Basket.jsx');
var CashCalculator = require('../components/CashCalculator.jsx');
var StripePayment  = require('../components/StripePayment.jsx');
var DividingTitle  = require('../components/general/DividingTitle.jsx');
var LoadingSpinner = require('../components/general/LoadingSpinner.jsx');
var Modal          = require('../components/general/Modal.jsx');
var ModalBody      = require('../components/general/ModalBody.jsx');
var CustomerInfo   = require('../components/CustomerInfo.jsx');


var Checkout = React.createClass({
  mixins: [queryIdMixin, Navigation],

  getInitialState: function() {
    return {
      order:   null,
      loading: true
    };
  },

  setDiscount: function(value) {
    if (value) {
      request
        .put(api.orders + this.getIdParam())
        .send({discount: value})
        .end(function(err, res) {
          if (err) {
            if (err.status === 422) {
              this.props.APP.flashMessage.show('error', res.body.errors);
            } else {
              console.log(err);
            }
            return;
          }

          this.props.APP.flashMessage.show('info', res.body.message);

          this.setState({
            order: res.body.context.order
          });
        }.bind(this));
    }
  },

  getTotal: function() {
    return (this.state.order.total * this.props.APP.config.tax) - ('discount' in this.state.order ? this.state.order.discount : 0);
  },

  submitPayment: function(payment, paymentMethod) {
    var refs     = this.refs;
    var method   = paymentMethod || 'cash';
    var total    = this.getTotal();
    var checkoutDetails;

    if (payment) {
      if (payment < total) {
        refs.cashCalculator.showError('Payment cannot be less than the total price');
      } else {
        refs.cashCalculator.clearError();

        checkoutDetails = {
          method   : method,
          status   : 'paid',
          payment  : payment,
          change   : payment - total
        };

        util.addInputsToObj(checkoutDetails, refs);

        request
          .put(api.orders + this.getIdParam())
          .send(checkoutDetails)
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

            this.transitionTo('done', { id: this.getIdParam() });
          }.bind(this));
      }
    }
  },

  showPaymentSection: function() {
    var state = this.state;
    var infoMessage = 'Total: ' + util.asCurrency(this.getTotal());

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
                buttonClass='button-block button-primary'
                buttonIcon='fa fa-money icon-spacing'
                onClose={this.onCashModalClose}
                title='Cash Payment'
              >
                <ModalBody>
                  <CashCalculator
                    ref='cashCalculator'
                    onCancel={this.cancelCashPayment}
                    onSubmit={this.submitPayment}
                    infoMessage={infoMessage}
                  />
                </ModalBody>
              </Modal>
            </div>

            <div className='six columns payment-card v-margin'>
              <StripePayment total={this.getTotal()} onSuccess={this.submitPayment} />
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
    var id = this.getIdParam();

    if (id) {
      this.getById(id, api.orders, function(order) {
        this.setState({
          order:   order,
          loading: false
        });
      });
    } else {
      this.transitionTo('pending');
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
          discount={state.order.discount}
          renderStaticItems={true}
        />

        <CustomerInfo order={state.order} APP={this.props.APP} setDiscount={this.setDiscount} />

        <DividingTitle dashed={true} title='Payment' />

        {this.showPaymentSection()}
      </div>
    );
  }
});

module.exports = Checkout;
