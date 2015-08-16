/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var util = require('../../utility/util');


var SelectDateRange = React.createClass({
  propTypes: {
    yearsRange: React.PropTypes.array.isRequired
  },

  getInitialState: function() {
    var d = new Date();
    var today = {
      day:   d.getDate(),
      month: util.getMonthName(d.getMonth()),
      year:  d.getFullYear()
    };

    // advance by one day
    d.setDate(d.getDate() + 1);
    var tomorrow = {
      day:   d.getDate(),
      month: util.getMonthName(d.getMonth()),
      year:  d.getFullYear()
    };

    return {
      from: today,
      to:   tomorrow,
      hideTo: true
    };
  },

  toggleDateTo: function() {
    // TODO
  },

  createDateSelect: function(type) {
    var state = this.state;
    var years = this.props.yearsRange.map(function(year) {
      return (
        <option key={year} value={year}>{year}</option>
      );
    });
    var days = [];

    for (var day = 1; day <= 31; day++) {
      days.push(<option key={day} value={day}>{day}</option>);
    };

    return (
      <span className='date-select'>
        <select ref={'input' + type + 'day'} defaultValue={type === 'from' ? state.from.day : state.to.day}>
          {days}
        </select>

        <select ref={'input' + type + 'month'} defaultValue={type === 'from' ? state.from.month : state.to.month}>
          <option value='Jan'>January</option>
          <option value='Feb'>February</option>
          <option value='Mar'>March</option>
          <option value='Apr'>April</option>
          <option value='May'>May</option>
          <option value='June'>June</option>
          <option value='July'>July</option>
          <option value='Aug'>August</option>
          <option value='Sept'>September</option>
          <option value='Oct'>October</option>
          <option value='Nov'>November</option>
          <option value='Dec'>December</option>
        </select>

        <select ref={'input' + type + 'year'} defaultValue={type === 'from' ? state.from.year : state.to.year}>
          {years}
        </select>
      </span>
    );
  },

  render: function() {
    return (
      <div className='select-date-range-wrapper'>
        <div className='date-from u-pull-left'>
          <label className='field-label label-width-auto'>From:</label>

          {this.createDateSelect('from')}
        </div>

        <div className='date-to u-pull-left'>
          <label className='field-label label-width-auto'>To:</label>

          {this.createDateSelect('to')}

        </div>
      </div>
    );
  }
});

module.exports = SelectDateRange;
