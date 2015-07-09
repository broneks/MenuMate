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
      display: 0
    };
  },

  render: function() {
    var state = this.state;

    return (
      <div className='cash-calculator container'>
        <div className='display-wrapper'>
          <div className='display'>{state.display}</div>
        </div>

        <div className='buttons-pad'>
          <div className='row'>
            <div className='four columns'>
              <button className='pad-button button'>4</button>
            </div>
            <div className='four columns'>
              <button className='pad-button button'>5</button>
            </div>
            <div className='four columns'>
              <button className='pad-button button'>6</button>
            </div>
          </div>

          <div className='row'>
            <div className='four columns'>
              <button className='pad-button button'>4</button>
            </div>
            <div className='four columns'>
              <button className='pad-button button'>5</button>
            </div>
            <div className='four columns'>
              <button className='pad-button button'>6</button>
            </div>
          </div>

          <div className='row'>
            <div className='four columns'>
              <button className='pad-button button'>1</button>
            </div>
            <div className='four columns'>
              <button className='pad-button button'>2</button>
            </div>
            <div className='four columns'>
              <button className='pad-button button'>3</button>
            </div>
          </div>

          <div className='row'>
            <div className='four columns'>
              <button className='pad-button button'>0</button>
            </div>
            <div className='four columns'>
              <button className='pad-button button' id='decimal-button'>&#183;</button>
            </div>
            <div className='four columns'>
              <button className='pad-button button' id='equals-button'>&#61;</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = CashCalculator;
