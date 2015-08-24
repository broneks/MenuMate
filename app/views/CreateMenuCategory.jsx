/**
 * @jsx React.DOM
 */

var React   = require('react/addons');
var request = require('superagent');

var api  = require('../utility/api-endpoints');
var util = require('../utility/util');

var ClearForm = require('../components/general/ClearForm.jsx');

var CreateMenuCategory = React.createClass({
  cancelSubmit: function(e) {
    e.preventDefault();
  },

  createMenuCategory: function() {
    var refs = this.refs;
    var categoryDetails = {};

    util.addInputsToObj(categoryDetails, refs);

    request
      .post(api.categories)
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

        util.clearInputs(refs);
        this.props.APP.flashMessage.show('info', res.body.message);
      }.bind(this));
  },

  render: function() {
    return (
      <div className='create-menu-category'>
        <h4>Create a Menu Category</h4>

        <form onSubmit={this.cancelSubmit}>
          <div className='row'>
            <div className='six columns'>
              <label htmlFor='name' className='label required'>Name</label>
              <input type='text' ref='input_name' name='name' className='u-full-width' autoFocus />
            </div>
          </div>

          <div className='row'>
            <div className='six columns v-double-margin'>
              <button className='button-primary button-block' onClick={this.createMenuCategory}>Create Menu Category</button>
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

module.exports = CreateMenuCategory;
