/**
 * @jsx React.DOM
 */

var React   = require('react/addons');
var State   = require('react-router').State;
var request = require('superagent');

var Basket           = require('../components/Basket.jsx');
var PendingCustomers = require('../components/PendingCustomers.jsx');

var api = require('../utility/api-endpoints');


var Checkout = React.createClass({
  mixins: [State],

  getInitialState: function() {
    return {
      id:       null,
      customer: null
    };
  },

  getId: function(nextProps) {
    var id    = nextProps ? nextProps.params.id : this.getParams().id;
    var isInt = /^\d+$/g.test(id);

    if (isInt) return id;

    return null;
  },

  getCustomerById: function(id, callback) {
    request
      .get(api.customers + id)
      .end(function(err, res) {
        if (err) {
          console.log('Error');
          return;
        }

        if (this.isMounted()) {
          this.setState({
            customer: res.body
          });
        }
      }.bind(this));
  },

  componentWillMount: function() {
    var id = this.getId();

    this.setState({ id: id });
  },

  componentDidMount: function() {
    var id = this.state.id;

    if (id) {
      this.getCustomerById(id);
    }
  },

  componentWillReceiveProps: function(nextProps) {
    // var id           = this.getId(nextProps);
    // var differentUrl = this.state.id !== id;
    // var updated      = {
    //   id:       null,
    //   customer: null
    // };
    //
    // if (differentUrl) {
    //   this.getCustomerById(id);
    //
    //   updated.id       = id;
    //   updated.customer = this.state.customer;
    // }
    //
    // this.setState(updated);
    //
    // this.forceUpdate();
  },

  render: function() {
    var state = this.state;

    if (state.customer) {
        // <Basket
        //   renderOnlyItems={true}
        //   customer={state.customer}
        // />
      return (
        <div>test</div>
      );
    }

    return (
      <PendingCustomers />
    );
  }
});

module.exports = Checkout;
