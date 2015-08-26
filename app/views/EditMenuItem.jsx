/**
 * @jsx React.DOM
 */

var React      = require('react/addons');
var request    = require('superagent');
var Navigation = require('react-router').Navigation;

var api  = require('../utility/api-endpoints');
var util = require('../utility/util');

var queryIdMixin = require('../mixins/queryId');

var LoadingSpinner = require('../components/general/LoadingSpinner.jsx');
var ImagePreview   = require('../components/general/ImagePreview.jsx');
var ClearForm      = require('../components/general/ClearForm.jsx');
var RadioGroup     = require('../components/general/RadioGroup.jsx');
var RadioButton    = require('../components/general/RadioButton.jsx');
var ItemSummary    = require('../components/ItemSummary.jsx');


var EditMenuItem = React.createClass({
  mixins: [queryIdMixin, Navigation],

  getInitialState: function() {
    return {
      categories: [],
      menuItem:   null,
      reader:     null,
      preview:    null,
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
          if (res.body.length) {
            this.setState({
              categories: res.body,
              loading:    false
            });
          } else {
            this.props.APP.flashMessage.show('info', 'please create some menu categories');
          }
        }
      }.bind(this));
  },

  isImage: function(file) {
    return this.refs.imagePreview.isImage(file);
  },

  previewImage: function(e) {
    this.refs.imagePreview.setSrc(e.target.files[0]);
  },

  editMenuItem: function() {
    var refs = this.refs;
    var menuItemDetails = {};
    var file = refs.input_image.getDOMNode().files[0];
    var id   = this.getIdParam();

    util.addInputsToObj(menuItemDetails, refs);

    request
      .put(api.manage.menuItems.standard + id)
      .send(menuItemDetails)
      .end(function(err, res) {
        if (err) {
          if (err.status === 422) {
            this.props.APP.flashMessage.show('error', res.body.errors);
          } else {
            console.log(err);
          }
          return;
        }

        if (file && this.isImage(file)) {
          this.props.APP.flashMessage.hide();

          //
          // overly complicated request just to get image uploading to work...
          //
          request
            .put(api.manage.menuItems.standard + id)
            .attach('image', file, file.name)
            .field('name', menuItemDetails.name)
            .field('onsale', menuItemDetails.onsale)
            .field('category', menuItemDetails.category)
            .field('price', menuItemDetails.price)
            .field('description', menuItemDetails.description)
            .field('ingredients', menuItemDetails.ingredients || '')
            .end(function(err, r) {
              if (err) {
                if (err.status === 422) {
                  this.props.APP.flashMessage.show('error', r.body.errors);
                } else {
                  console.log(err);
                }
                return;
              }
              this.props.APP.flashMessage.show('info', r.body.message);

            }.bind(this));
        } else {
          this.props.APP.flashMessage.show('info', res.body.message);
        }
      }.bind(this));
  },

  cancelSubmit: function(e) {
    e.preventDefault();
  },

  categorySelect: function() {
    var categories = this.state.categories.map(function(category, index) {
      return (
        <option key={index} value={category._id}>{category.name}</option>
      );
    });

    return (
      <select ref='input_category' name='category' className='category-select u-full-width' defaultValue={this.state.menuItem.category._id}>
        <option value=''></option>
        {categories}
      </select>
    );
  },

  componentDidMount: function() {
    var id = this.getIdParam();

    if (id) {
      this.getById(id, api.manage.menuItems.standard, function(menuItem) {
        this.setState({
          menuItem: menuItem
        });
      });

      this.getCategories();
    } else {
      this.transitionTo('manageMenu');
    }
  },

  render: function() {
    var state = this.state;
    var message;

    if (!state.menuItem || !state.categories.length) {
      if (state.loading) {
        message = <div className='message-center'><LoadingSpinner /></div>;
      } else {
        message = <div className='message-center empty-message'>No results were retrieved</div>;
      }

      return (
        <div className='message-wrapper'>
          {message}
        </div>
      );
    }

    return (
      <div className='create-menu-item'>
        <h4>Edit a Menu Item</h4>

        <ItemSummary item={state.menuItem} />

        <form encType='multipart/form-data' onSubmit={this.cancelSubmit}>
          <div className='row'>
            <div className='six columns'>
              <label htmlFor='name' className='label required'>Name</label>
              <input type='text' ref='input_name' name='name' className='u-full-width' defaultValue={state.menuItem.name} />
            </div>

            <div className='six columns'>
              <span className='label'>Visibility</span>

              <RadioGroup ref='input_onsale'>
                <RadioButton id='on-sale' name='visibility' label='on sale' value='true' defaultChecked={state.menuItem.onsale}></RadioButton>
                <RadioButton id='off-sale' name='visibility' label='off sale' value='false' defaultChecked={!state.menuItem.onsale}></RadioButton>
              </RadioGroup>
            </div>
          </div>

          <div className='row'>
            <div className='six columns'>
              <label htmlFor='category' className='label required'>Category</label>
              {this.categorySelect()}
            </div>

            <div className='six columns'>
              <label htmlFor='price' className='label required'>Price</label>
              <input type='text' ref='input_price' name='price' className='u-full-width' defaultValue={state.menuItem.price} />
            </div>
          </div>

          <div className='row'>
            <div className='six columns'>
              <label htmlFor='description' className='label required'>Description</label>
              <textarea ref='input_description' name='description' className='u-full-width' defaultValue={state.menuItem.description}></textarea>
            </div>

            <div className='six columns'>
              <label htmlFor='ingredients' className='label'>Ingredients</label>
              <textarea ref='input_ingredients' name='ingredients' className='u-full-width' defaultValue={state.menuItem.ingredients}></textarea>
            </div>
          </div>

          <div className='row'>
            <div className='six columns'>
              <label htmlFor='image' className='label'>Image</label>
              <input type='file' ref='input_image' name='image' className='u-full-width' accept='image/*' onChange={this.previewImage} />
            </div>

            <div className='six columns'>
              <ImagePreview ref='imagePreview' src={this.props.APP.config.url.path + state.menuItem.image} />
            </div>
          </div>

          <div className='row'>
            <div className='six columns v-double-margin'>
              <button className='button-primary button-block' onClick={this.editMenuItem}>Edit Menu Item</button>
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

module.exports = EditMenuItem;
