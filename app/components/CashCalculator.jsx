/**
 * @jsx React.DOM
 */

var React      = require('react/addons');
var request    = require('superagent');

var api = require('../utility/api-endpoints');

var util = require('../utility/util');

var CashCalculator = React.createClass({
  propTypes: {
    onCancel:    React.PropTypes.func.isRequired,
    onSubmit:    React.PropTypes.func.isRequired,
    infoMessage: React.PropTypes.string
  },

  getInitialState: function() {
    return {
      error:   '',
      display: '0'
    };
  },

  clearDisplay: function() {
    this.setState({
      display: '0'
    });
  },

  updateDisplay: function(value) {
    var currentDisplay    = this.state.display;
    var displayHasDecimal = currentDisplay.indexOf('.') >= 0;
    var updatedDisplay;
    var trimmed;

    // if (!displayHasDecimal && value !== 'backspace' && value !== '.') {
    //   // max length of 4 digits preceding the decimal place
    //   if (currentDisplay.length >= 4) return;
    // }

    if (value === 'backspace') {
      trimmed = currentDisplay.slice(0, -1);
      updatedDisplay = trimmed.length ? trimmed : '0';
    } else if (value === '.') {
      // only allow one decimal
      if (displayHasDecimal) return;
      updatedDisplay = currentDisplay + value;
    } else {
      // only allow two decimal places
      if (displayHasDecimal && currentDisplay.split('.')[1].length === 2) return;
      updatedDisplay = currentDisplay !== '0' ? currentDisplay + value : value;
    }

    this.setState({
      display: updatedDisplay
    });
  },

  showError: function(message) {
    if (message) {
      this.setState({
        error: message
      });
    }
  },

  clearError: function() {
    this.setState({
      error: ''
    });
  },

  cancel: function(e) {
    e.stopPropagation();

    this.clearDisplay();
    this.clearError();
    this.props.onCancel();
  },

  submit: function(e) {
    e.stopPropagation();

    this.props.onSubmit(this.state.display);
  },

  render: function() {
    var state = this.state;
    var props = this.props;

    var infoMessage  = props.infoMessage ? <div className='info-message'>{props.infoMessage}</div> : null;
    var errorMessage = state.error ? <div className='error-message'>{state.error}</div> : null;

    return (
      <div className='cash-calculator'>
        <div className='flow-control'>
          <div className='row'>
            <div className='four columns v-margin'>
              <button className='button button-block' onClick={this.cancel}>Cancel</button>
            </div>
            <div className='eight columns v-margin'>
              <button className='button button-block' onClick={this.submit}>Submit</button>
            </div>
          </div>
        </div>

        <div className='display-wrapper'>
          {infoMessage}
          {errorMessage}
          <div className='display'>{state.display}</div>
        </div>

        <div className='buttons-pad'>
          <div className='row'>
            <div className='four columns'>
              <button className='pad-button button' onClick={this.updateDisplay.bind(null, '7')}>7</button>
            </div>
            <div className='four columns'>
              <button className='pad-button button' onClick={this.updateDisplay.bind(null, '8')}>8</button>
            </div>
            <div className='four columns'>
              <button className='pad-button button' onClick={this.updateDisplay.bind(null, '9')}>9</button>
            </div>
          </div>

          <div className='row'>
            <div className='four columns'>
              <button className='pad-button button' onClick={this.updateDisplay.bind(null, '4')}>4</button>
            </div>
            <div className='four columns'>
              <button className='pad-button button' onClick={this.updateDisplay.bind(null, '5')}>5</button>
            </div>
            <div className='four columns'>
              <button className='pad-button button' onClick={this.updateDisplay.bind(null, '6')}>6</button>
            </div>
          </div>

          <div className='row'>
            <div className='four columns'>
              <button className='pad-button button' onClick={this.updateDisplay.bind(null, '1')}>1</button>
            </div>
            <div className='four columns'>
              <button className='pad-button button' onClick={this.updateDisplay.bind(null, '2')}>2</button>
            </div>
            <div className='four columns'>
              <button className='pad-button button' onClick={this.updateDisplay.bind(null, '3')}>3</button>
            </div>
          </div>

          <div className='row'>
            <div className='four columns'>
              <button className='pad-button button' id='backspace-button' onClick={this.updateDisplay.bind(null, 'backspace')}>
                <i className='fa fa-arrow-left'></i>
              </button>
            </div>
            <div className='four columns'>
              <button className='pad-button button' onClick={this.updateDisplay.bind(null, '0')}>0</button>
            </div>
            <div className='four columns'>
              <button className='pad-button button' id='decimal-button' onClick={this.updateDisplay.bind(null, '.')}>&#183;</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = CashCalculator;
