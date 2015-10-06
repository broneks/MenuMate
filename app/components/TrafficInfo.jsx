/**
 * @jsx React.DOM
 */

var React   = require('react/addons');
var request = require('superagent');

var api  = require('../utility/api-endpoints');
var util = require('../utility/util');

var LoadingSpinner = require('./general/LoadingSpinner.jsx');
var DividingTitle  = require('./general/DividingTitle.jsx');


var TrafficInfo = React.createClass({
  propTypes: {
    dateString: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
      traffic:  null,
      loading: true
    };
  },

  getTrafficByDateRange: function(props) {
    request
      .get(api.review.traffic + props.dateString)
      .end(function(err, res) {
        if (err) {
          console.log(err);
          return;
        }

        var traffic;

        if (res.body && 'message' in res.body) {
          traffic = null;
        } else {
          traffic = res.body;
        }

        this.setState({
          traffic:  traffic,
          loading: false
        }, function() {
          // if (traffic) {
            // this.renderChart();
          // }
        }.bind(this));
      }.bind(this));
  },

  renderChart: function() {
    var vis     = d3.select('#traffic-svg');
    var WIDTH   = 650;
    var HEIGHT  = 400;
    var MARGINS = {
      top:    20,
      right:  20,
      bottom: 20,
      left:   50
    };

    var traffic = this.state.traffic;
    var dateKey = this.state.traffic.meta.dateKey;
    var dateRange  = [];
    var countRange = [];

    dateRange.push(traffic.meta.dateRange.smallest);
    dateRange.push(traffic.meta.dateRange.largest);
    countRange.push(0);
    countRange.push(traffic.meta.countRange.largest);

    vis.selectAll('*').remove();

    var xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain(dateRange);

    var yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain(countRange);

    var xAxis = d3.svg.axis()
        .scale(xScale);
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');

    vis.append("svg:g")
        .attr("class","axis")
        .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
        .call(xAxis);

    vis.append("svg:g")
        .attr("class","axis")
        .attr("transform", "translate(" + (MARGINS.left) + ",0)")
        .call(yAxis);

    var lineGen = d3.svg.line()
      .x(function(d) {
        return xScale(d._id[dateKey]);
      })
      .y(function(d) {
        return yScale(d.count);
      });
     //.interpolate("basis");

    vis.append('svg:path')
      .attr('d', lineGen(traffic.data))
      .attr('stroke', 'green')
      .attr('stroke-width', 2)
      .attr('fill', 'none');
  },

  getTrafficInfoLabel: function(date) {
    var label = util.capitalize(util.keys(date._id)[0]);
    var num   = date._id[this.state.traffic.meta.dateKey];

    if (label === 'Hour') {
      num = (num < 10 ? '0' + num : num) + ':00';
    } else if (label === 'Month') {
      num = util.getMonthName(num);
    } else if (label === 'Dayofmonth') {
      label = 'Day of month';
    }

    return label + ' - ' + num;
  },

  componentWillReceiveProps: function(nextProps) {
    this.getTrafficByDateRange(nextProps);
  },

  render: function() {
    var state = this.state;
    var info;

    if (!state.traffic) {
      if (state.traffic == null) {
        info = <div className='text-center text-muted'>. . .</div>
      } else {
        info = <LoadingSpinner message='Loading traffic info' />;
      }
    } else {
      // info = (
      //   <svg id='traffic-svg' width='650' height='400'></svg>
      // );

      info = state.traffic.data.map(function(date, index) {
        return (
          <li key={index}>
            <span className="label">
              <span className="label-text">{this.getTrafficInfoLabel(date)}</span>
            </span>
            <span>{date.count + (date.count === 1 ? ' Customer' : ' Customers')}</span>
          </li>
        );
      }, this);
    }

    return (
      <div className='traffic-review'>
        <DividingTitle title='Traffic Info' />

        <ul>{info}</ul>
      </div>
    );
  }
});

module.exports = TrafficInfo;
