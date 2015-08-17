/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var util = require('../../utility/util');


var SelectDateRange = React.createClass({
  propTypes: {
    onChange:   React.PropTypes.func.isRequired,
    yearsRange: React.PropTypes.array.isRequired
  },

  getInitialState: function() {
    var d = new Date();
    var today = {
      day:   d.getDate().toString(),
      month: util.getMonthName(d.getMonth()),
      year:  d.getFullYear().toString()
    };

    // advance by one day
    d.setDate(d.getDate() + 1);
    var tomorrow = {
      day:   d.getDate().toString(),
      month: util.getMonthName(d.getMonth()),
      year:  d.getFullYear().toString()
    };

    return {
      today:    today,
      tomorrow: tomorrow,
      from:     today,
      to:       tomorrow
    };
  },

  datesAreEqual: function(one, two) {
    return JSON.stringify(one) === JSON.stringify(two);
  },

  setDateSelect: function(type) {
    var refs     = this.refs;
    var updated  = {};
    var newValue = type === 'from' ? this.state.today : this.state.tomorrow;

    if (!this.datesAreEqual(this.state[type], newValue)) {
      updated[type] = newValue;

      refs['input_' + type + '_day'].getDOMNode().value   = newValue.day;
      refs['input_' + type + '_month'].getDOMNode().value = newValue.month;
      refs['input_' + type + '_year'].getDOMNode().value  = newValue.year;

      this.setState(updated, function() {
        this.props.onChange(this.state.from, this.state.to);
      });
    }
  },

  onChange: function(e) {
    var target = e.target;
    var targetClass = target.className.split('-');
    var updated  = {};
    var newValue = {};

    newValue[targetClass[2]] = {$set: target.value};
    updated[targetClass[1]]  = React.addons.update(this.state[targetClass[1]], newValue);

    this.setState(updated, function() {
      this.props.onChange(this.state.from, this.state.to);
    });
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
        <select ref={'input_' + type + '_day'} className={'select-' + type + '-day'} defaultValue={type === 'from' ? state.from.day : state.to.day} onChange={this.onChange}>
          {days}
        </select>

        <select ref={'input_' + type + '_month'} className={'select-' + type + '-month'} defaultValue={type === 'from' ? state.from.month : state.to.month} onChange={this.onChange}>
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

        <select ref={'input_' + type + '_year'} className={'select-' + type + '-year'} defaultValue={type === 'from' ? state.from.year : state.to.year} onChange={this.onChange}>
          {years}
        </select>
      </span>
    );
  },

  componentDidMount: function() {
    // send initial date range
    this.props.onChange(this.state.from, this.state.to);
  },

  render: function() {
    var hideToClass = this.state.hideTo ? 'hide' : null;
    return (
      <div className='select-date-range-wrapper'>
        <div className='date-from u-pull-left'>
          <a className='set-date set-date-today' onClick={this.setDateSelect.bind(null, 'from')}>Set As Today</a>

          <div className='date-select-wrapper'>
            <label className='field-label label-width-auto'>From:</label>

            {this.createDateSelect('from')}
          </div>
        </div>

        <div className='date-to u-pull-left'>
          <a className='set-date set-date-tomorrow' onClick={this.setDateSelect.bind(null, 'to')}>Set As Tomorrow</a>

          <div className='date-select-wrapper'>
            <label className='field-label label-width-auto'>To:</label>

            {this.createDateSelect('to')}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = SelectDateRange;
