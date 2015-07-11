/**
 * @jsx React.DOM
 */

var React      = require('react/addons');
var request    = require('superagent');
var Navigation = require('react-router').Navigation;

var api = require('../utility/api-endpoints');

var util = require('../utility/util');

var CashCalculator = React.createClass({
  getInitialState: function() {
    return {
      display: '0'
    };
  },

  updateDisplay: function(value) {
    var display = this.state.display;
    var updatedDisplay;
    var trimmed;

    if (value === 'backspace') {
      trimmed = display.slice(0, -1);
      updatedDisplay = trimmed.length ? trimmed : '0';
    } else {
      updatedDisplay = (value === '.' || display !== '0') ? display + value : value;
    }

    this.setState({
      display: updatedDisplay
    });
  },

  cancelPayment: function(e) {
    e.stopPropagation();

    if(confirm('Cancel the cash payment?')) {
      // TODO: close modal and return to pending checkout view
    }
  },

  submitPayment: function() {
    // TODO: calculate change back then post checkout data and proceed to receipt
  },

  render: function() {
    var state = this.state;

    return (
      <div className='cash-calculator'>
        <div className='flow-control'>
          <div className='row'>
            <div className='four columns v-margin'>
              <button className='button button-block' onClick={this.cancelPayment}>Cancel</button>
            </div>
            <div className='eight columns v-margin'>
              <button className='button button-block' onClick={this.submitPayment}>Done</button>
            </div>
          </div>
        </div>

        <div className='display-wrapper'>
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
