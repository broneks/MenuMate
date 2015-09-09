/**
 * @jsx React.DOM
 */

var React   = require('react/addons');
var request = require('superagent');

var api  = require('../utility/api-endpoints');
var util = require('../utility/util');

var DividingTitle  = require('./general/DividingTitle.jsx');


var CustomerInfo = React.createClass({
  propTypes: {
    order:       React.PropTypes.object.isRequired,
    APP:         React.PropTypes.object.isRequired,
    setDiscount: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {
      isNewCustomer: false,
      customer:      null
    };
  },

  getCustomerByOrderId: function() {
    var orderId = this.props.order._id;

    if (!orderId) return;

    request
      .get(api.customers.byOrder + orderId)
      .end(function(err, res) {
        if (err) {
          console.log(err);
        }

        this.setState({
          customer: res.body
        });
      }.bind(this));
  },

  setIsNewCustomer: function(e) {
    var checked = e.target.checked;

    if (!checked) {
      this.props.APP.flashMessage.hide();
    }

    this.setState({
      isNewCustomer: checked
    });
  },

  submitCustomer: function() {
    var refs = this.refs;
    var customerDetails = {};

    util.addInputsToObj(customerDetails, refs);

    customerDetails.order = {
      id:    this.props.order._id,
      total: this.props.order.total
    };

    if (this.state.isNewCustomer) {
      this.createCustomer(customerDetails);
    } else {
      this.updateCustomer(customerDetails);
    }
  },

  createCustomer: function(customerDetails) {
    request
      .post(api.customers.standard)
      .send(customerDetails)
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
          customer: res.body.context.customer
        });

      }.bind(this));
  },

  updateCustomer: function(customerDetails) {
    request
      .put(api.customers.byCode + customerDetails.code)
      .send(customerDetails)
      .end(function(err, res) {
        if (err) {
          if (err.status === 422) {
            this.props.APP.flashMessage.show('error', res.body.errors);
          } else {
            console.log(err);
          }
          return;
        }

        if (res.body.message) {
          this.props.APP.flashMessage.show('info', res.body.message);
        } else {
          this.props.APP.flashMessage.hide();

          this.setState({
            customer: res.body
          }, function() {
            this.setDiscount();
          });
        }
      }.bind(this));
  },

  uppercase: function(ref) {
    var node = this.refs[ref].getDOMNode();

    node.value = util.uppercase(node.value);
  },

  setWallet: function(wallet, callback) {
    request
      .put(api.customers.byOrder + this.props.order._id)
      .send({wallet: wallet})
      .end(function(err, res) {
        if (err) {
          console.log(err);
        }
        callback.call(this);
      }.bind(this));
  },

  setDiscount: function() {
    var wallet = this.state.customer.rewards.wallet;
    var total  = this.props.order.total * this.props.APP.config.tax;
    var discountedTotal;

    if (wallet) {
      if (wallet < total) {
        discountedTotal = wallet;
        wallet          = 0;
      } else if (wallet >= total) {
        discountedTotal = total;
        wallet          = wallet - total;
      }

      this.setWallet(wallet, function() {
        this.props.setDiscount(discountedTotal);
      });
    }

    return util.asCurrency(wallet);
  },

  componentDidMount: function() {
    this.getCustomerByOrderId();
  },

  render: function() {
    var state = this.state;
    var props = this.props;

    var toggleAdditional = this.state.isNewCustomer ? {display: 'block'} : {display: 'none'};
    var submitText       = this.state.isNewCustomer ? 'Create Customer' : 'Check Loyalty';
    var customerName;
    var customerRewardExists;
    var customerReward;
    var customerRewardType;

    if (state.customer) {
      customerName = state.customer.name ? (
        <div className='row'>
          <div className='customer-name six columns v-margin'>
            <span className='label'>Name:</span>
            {state.customer.name}
          </div>
        </div>
      ) : null;

      customerRewardExists = props.order._id in this.state.customer.rewards;
      customerReward       = customerRewardExists ? util.asCurrency(state.customer.rewards[props.order._id].reward) : 'none';
      customerRewardType   = customerRewardExists ? '(' + state.customer.rewards[props.order._id].type + ')' : null;

      return (
        <section className='loyalty v-double-margin'>
          <DividingTitle title='Customer Info' dashed={true} />

          <div className='row v-margin'>
            <div className='loyalty-code six columns v-margin'>
              <span className='label'>Loyalty Code:</span>
              <span className='value'>{state.customer.code}</span>
            </div>

            <div className={'loyalty-reward six columns v-margin' + (customerRewardExists ? ' reward-received' : '')}>
              <span className='label'>Loyalty Reward:</span>
              <span className='value'>{customerReward}</span>
              <div className='type text-muted'>{customerRewardType}</div>
            </div>
          </div>

          {customerName}
        </section>
      );
    }

    if (props.order.status !== 'pending') {
      return (
        <section className='loyalty'></section>
      );
    }

    return (
      <section className='loyalty v-double-margin'>
        <DividingTitle title='Customer Info' dashed={true} />

        <div className='row'>
          <div className='checkbox-wrapper six columns'>
            <label htmlFor='new-customer' className='label label-block'>
              <span className='checkbox-label'>New Customer?</span>
              <input type='checkbox' id='new-customer' name='newCustomer' value='true' onChange={this.setIsNewCustomer} />
            </label>
          </div>
        </div>

        <div className='row'>
          <div className='six columns'>
            <input type='text' className='u-full-width' ref='input_code' name='code' placeholder='loyalty code' onBlur={this.uppercase.bind(null, 'input_code')} />
          </div>

          <div className='six columns'>
            <div className='customer-info-additional' style={toggleAdditional}>
              <input type='text' className='u-full-width' ref='input_postal' name='postal' placeholder='postal code' maxLength='6' onBlur={this.uppercase.bind(null, 'input_postal')} />

              <input type='text' className='u-full-width' ref='input_name' name='name' placeholder='customer name' />
            </div>

            <button className='button button-block' onClick={this.submitCustomer}>{submitText}</button>
          </div>
        </div>
      </section>
    );
  }
});

module.exports = CustomerInfo;
