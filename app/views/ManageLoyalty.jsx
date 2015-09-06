/**
 * @jsx React.DOM
 */

var React      = require('react/addons');
var request    = require('superagent');

var api  = require('../utility/api-endpoints');
var util = require('../utility/util');

var ClearForm      = require('../components/general/ClearForm.jsx');
var LoadingSpinner = require('../components/general/LoadingSpinner.jsx');
var ItemSummary    = require('../components/ItemSummary.jsx');


var ManageLoyalty = React.createClass({
  cancelSubmit: function(e) {
    e.preventDefault();
  },

  getInitialState: function() {
    return {
      customers: null,
      loyalty:   null,
      loading:   true
    };
  },

  editLoyaltyReward: function() {
    var refs = this.refs;
    var loyaltyDetails = {};
    var loyaltyId = this.state.loyalty ? this.state.loyalty._id : null;
    var onEnd     = function(err, res) {
      if (err) {
        if (err.status === 422) {
          this.props.APP.flashMessage.show('error', res.body.errors);
        } else {
          console.log(err);
        }
        return;
      }

      this.props.APP.flashMessage.show('info', res.body.message);
    };

    util.addInputsToObj(loyaltyDetails, refs);

    console.log(loyaltyDetails);

    if (loyaltyId) {
      request
        .put(api.loyalty + loyaltyId)
        .send(loyaltyDetails)
        .end(onEnd.bind(this));
    } else {
      request
        .post(api.loyalty)
        .send(loyaltyDetails)
        .end(onEnd.bind(this));
    }
  },

  getLoyaltyAndCustomers: function() {
    request
      .get(api.loyalty)
      .end(function(err, res) {
        if (err) {
          console.log(err);
          return;
        }

        request
          .get(api.customers)
          .end(function(err, r) {
            this.setState({
              loyalty:   res.body,
              customers: r.body,
              loading:   false
            });
          }.bind(this));
      }.bind(this));
  },

  componentDidMount: function() {
    this.getLoyaltyAndCustomers();
  },

  render: function() {
    var state         = this.state;
    var loyaltyExists = !util.isObjEmpty(state.loyalty);

    if (!state.loyalty) {
      if (state.loading) {
        return (
          <div className='message-wrapper'>
            <div className='message-center'><LoadingSpinner /></div>
          </div>
        );
      }
    }

    return (
      <div className='manage-loyalty'>
        <h4>Manage Loyalty</h4>

        <ItemSummary item={state.loyalty} />

        <form onSubmit={this.cancelSubmit}>
          <div className='row'>
            <div className='six columns'>
              <label htmlFor='name' className='label required'>Name</label>
              <input type='text' ref='input_name' name='name' className='u-full-width' defaultValue={loyaltyExists ? state.loyalty.name : ''} />
            </div>

            <div className='six columns'>
              <label htmlFor='reward' className='label required'>Reward</label>
              <input type='text' ref='input_reward' name='reward' className='u-full-width' defaultValue={loyaltyExists ? state.loyalty.reward : ''} />
            </div>
          </div>

          <div className='row'>
            <div className='six columns'>
              <label htmlFor='goal' className='label required'>Spending Goal Amount ($)</label>
              <input type='text' ref='input_goal' name='goal' className='u-full-width' defaultValue={loyaltyExists ? state.loyalty.goal : ''} />
            </div>

            <div className='six columns'>
              <label htmlFor='startdate' className='label required'>Start Date</label>
              <input type='text' ref='input_startdate' name='startdate' className='u-full-width' defaultValue={loyaltyExists ? util.formatDate(state.loyalty.startdate) : ''} />
            </div>
          </div>

          <div className='row'>
            <div className='six columns'>
              <label htmlFor='description' className='label'>Description</label>
              <textarea ref='input_description' name='description' className='u-full-width' defaultValue={loyaltyExists ? state.loyalty.description : ''}></textarea>
            </div>
          </div>

          <div className='row'>
            <div className='six columns v-double-margin'>
              <button className='button-primary button-block' onClick={this.editLoyaltyReward}>{loyaltyExists ? 'Edit' : 'Create'} Loyalty Reward</button>
            </div>

            <div className='six columns v-double-margin'>
              <ClearForm refs={this.refs} flashMessage={this.props.APP.flashMessage} />
            </div>
          </div>
        </form>
      </div>
    );
  }
});

module.exports = ManageLoyalty;
