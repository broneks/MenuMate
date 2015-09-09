/**
 * @jsx React.DOM
 */

var React      = require('react/addons');
var request    = require('superagent');
var Navigation = require('react-router').Navigation;

var api  = require('../utility/api-endpoints');
var util = require('../utility/util');

var queryIdMixin = require('../mixins/queryId');

var ClearForm      = require('../components/general/ClearForm.jsx');
var LoadingSpinner = require('../components/general/LoadingSpinner.jsx');
var ItemSummary    = require('../components/ItemSummary.jsx');


var EditMenuCategory = React.createClass({
  mixins: [queryIdMixin, Navigation],

  cancelSubmit: function(e) {
    e.preventDefault();
  },

  getInitialState: function() {
    return {
      category: null,
      loading:  true
    };
  },

  editMenuCategory: function() {
    var refs = this.refs;
    var categoryDetails = {};

    util.addInputsToObj(categoryDetails, refs);

    request
      .put(api.categories + this.getIdParam())
      .send(categoryDetails)
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
      }.bind(this));
  },

  componentDidMount: function() {
    var id = this.getIdParam();

    if (id) {
      this.getById(id, api.categories, function(category) {
        this.setState({
          category: category,
          loading:  false
        });
      });
    } else {
      this.transitionTo('manageMenu');
    }
  },

  render: function() {
    var state = this.state;

    if (!state.category) {
      if (state.loading) {
        return (
          <div className='message-wrapper'>
            <div className='message-center'><LoadingSpinner /></div>
          </div>
        );
      }
    }

    return (
      <div className='create-menu-category'>
        <h4>Edit Menu Category</h4>

        <ItemSummary item={state.category} />

        <form onSubmit={this.cancelSubmit}>
          <div className='row'>
            <div className='six columns'>
              <label htmlFor='name' className='label required'>Name</label>
              <input type='text' ref='input_name' name='name' className='u-full-width' defaultValue={state.category.name} />
            </div>
          </div>

          <div className='row'>
            <div className='six columns v-double-margin'>
              <button className='button-primary button-block' onClick={this.editMenuCategory}>Edit Menu Category</button>
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

module.exports = EditMenuCategory;
