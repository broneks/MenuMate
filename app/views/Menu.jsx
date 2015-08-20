/**
 * @jsx React.DOM
 */

var React   = require('react/addons');
var request = require('superagent');

var api  = require('../utility/api-endpoints');
var util = require('../utility/util');

var LoadingSpinner = require('../components/general/LoadingSpinner.jsx');
var DividingTitle  = require('../components/general/DividingTitle.jsx');


var Menu = React.createClass({
  getInitialState: function() {
    return {
      categories: [],
      loading:    true
    };
  },

  getCategories: function() {
    request
      .get(api.categories)
      .end(function(err, res) {
        if (err) {
          console.log(err);
          return;
        }

        if (this.isMounted()) {
          this.setState({
            categories: res.body,
            loading:    false
          });
        }
      }.bind(this));
  },

  previewImage: function(e) {
    var file    = e.target.files[0];
    var preview = document.getElementById('image-preview');
    var reader  = new FileReader();

    preview.src = '';

    if (file.type.split('/')[0].toLowerCase() === 'image') {
      reader.onload = function(e) {
        preview.src = e.target.result;
      };

      reader.readAsDataURL(file);
    } else {
      // TODO: handle wrong type
    }
  },

  categorySelect: function() {
    var categories = this.state.categories.map(function(category, index) {
      return (
        <option key={index} value={category._id}>{category.name}</option>
      );
    });

    return (
      <select ref='input_category' className='category-select u-full-width'>
        {categories}
      </select>
    );
  },

  componentDidMount: function() {
    this.getCategories();
  },

  render: function() {
    var state = this.state;
    var message;

    if (!state.categories) {
      if (state.loading) {
        message = <div className='message-center'><LoadingSpinner /></div>;
      } else {
        message = <div className='message-center empty-message'>No results were retrieved</div>;
      }

      return (
        <div className='message-wrapper'>info</div>
      );
    }

    return (
      <div className='edit-menu'>
        <form>
          <div className='row'>
            <div className='six columns u-pull-right'>
              <img id='image-preview' />
            </div>
          </div>

          <div className='row'>
            <div className='six columns'>
              <label htmlFor='name' className='label'>Name</label>
              <input type='text' ref='input_name' className='u-full-width' />
            </div>

            <div className='six columns'>
              <label htmlFor='image' className='label'>Image</label>
              <input type='file' ref='input_image' className='u-full-width' accept='image/*' onChange={this.previewImage} />
            </div>
          </div>

          <div className='row'>
            <div className='six columns'>
              <label htmlFor='category' className='label'>Category</label>
              {this.categorySelect()}
            </div>

            <div className='six columns'>
              <label htmlFor='price' className='label'>Price</label>
              <input type='text' ref='input_price' className='u-full-width' />
            </div>
          </div>

          <div className='row'>
            <div className='six columns'>
              <label htmlFor='description' className='label'>Description</label>
              <textarea ref='input_description' className='u-full-width'></textarea>
            </div>

            <div className='six columns'>
              <label htmlFor='ingredients' className='label'>Ingredients</label>
              <textarea ref='input_ingredients' className='u-full-width'></textarea>
            </div>
          </div>
        </form>
      </div>
    );
  }
});

module.exports = Menu;
