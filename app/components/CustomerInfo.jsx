/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var util = require('../utility/util');

var LoadingSpinner = require('./general/LoadingSpinner.jsx');
var DividingTitle  = require('./general/DividingTitle.jsx');

var CustomerInfo = React.createClass({
  propTypes: {
    orders: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      gmarkers: []
    };
  },

  linkToMarker: function(pos) {
    var marker = this.state.gmarkers[pos];

    if (this.props.orders.info) {
      google.maps.event.trigger(marker, 'click');
    }
  },

  componentDidUpdate: function() {
    var props    = this.props;
    var gmarkers = this.state.gmarkers;
    var target   = document.getElementById('postal-map');
    var geocoder;
    var map;

    if (target && props.orders.info) {
      map = new google.maps.Map(target, {zoom: 9});
      geocoder = new google.maps.Geocoder();

      props.orders.info.customerInfo.forEach(function(customer) {
        geocoder.geocode({'address': customer.postal}, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);

            var marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location
            });

            google.maps.event.addListener(marker, 'click', function() {
              for (var i in gmarkers) {
                gmarkers[i].setAnimation(null);
              }
              marker.setAnimation(google.maps.Animation.BOUNCE);
              map.setCenter(marker.position);
            });

            gmarkers.push(marker);
          } else {
            // Handler Error
          }
        });
      });
    }
  },

  render: function() {
    var props = this.props;
    var postal;
    var info;

    if (!props.orders.info) {
      if (props.orders.info === null) {
        info = <div className='text-center text-muted'>. . .</div>
      } else {
        info = <LoadingSpinner message='Loading customer info' />;
      }
    } else {
      postal = props.orders.info.customerInfo.map(function(customer, index) {
        var pcode = customer.postal ? <a onClick={this.linkToMarker.bind(null, index)}>{customer.postal}</a> : <span className='text-muted'>no postal</span>;
        var email = customer.email || <span className='text-muted'>no email</span>;

        return (
          <li key={index} className='row'>
            <div className='columns six'>{pcode}</div>
            <div className='columns six'>{email}</div>
          </li>
        );
      }, this);

      info = (
        <div className='row'>
          <div className='columns six'>
            <ul className='postal-email-list'>
              {postal}
            </ul>
          </div>

          <div className='columns six'>
            <div id='postal-map' style={{height: '300px'}}></div>
          </div>
        </div>
      );
    }

    return (
      <div className='customer-review v-double-margin'>
        <DividingTitle title='Customer Info' dashed={true} />

        {info}
      </div>
    );
  }
});

module.exports = CustomerInfo;
