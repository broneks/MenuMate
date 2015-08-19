/**
 * @jsx React.DOM
 */

var React = require('react/addons');


var MarkerMap = React.createClass({
  propTypes: {
    data:     React.PropTypes.array.isRequired,
    dataItem: React.PropTypes.string.isRequired,
    center:   React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      map:      null,
      geocoder: new google.maps.Geocoder(),
      markers:  []
    };
  },

  componentDidMount: function() {
    var center = this.props.center;
    var target = document.getElementById('marker-map');

    this.setState({
      map: new google.maps.Map(target, {
        zoom:   10,
        center: center
      })
    });
  },

  componentDidUpdate: function() {
    var props   = this.props;
    var state   = this.state;
    var markers = [];
    var postalLinks = document.getElementsByClassName('postal-link');

    if (props.data && postalLinks.length) {
      props.data.forEach(function(item, index) {
        state.geocoder.geocode({'address': item[props.dataItem]}, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            state.map.setCenter(results[0].geometry.location);

            var marker = new google.maps.Marker({
              map:       state.map,
              position:  results[0].geometry.location,
              animation: google.maps.Animation.DROP
            });

            markers.push(marker);

            google.maps.event.addListener(marker, 'click', function() {
              for (var i in markers) {
                if (markers[i].getAnimation() !== null) {
                  markers[i].setAnimation(null);
                }
              }

              marker.setAnimation(google.maps.Animation.BOUNCE);
              state.map.setCenter(marker.position);
            });

            if (postalLinks[index]) {
              postalLinks[index].addEventListener('click', function() {
                google.maps.event.trigger(marker, 'click');
              });
            }
          }
        });
      });
    }
  },

  render: function() {
    return (
      <div id='marker-map'></div>
    );
  }
});

module.exports = MarkerMap;
