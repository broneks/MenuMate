/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var util = require('../../utility/util');


var Tabs = React.createClass({
  propTypes: {
    rowLength: React.PropTypes.number,
    items:     React.PropTypes.object.isRequired,
    onClick:   React.PropTypes.func.isRequired
  },

  getDefaultProps: function() {
    return {
      rowLength: 5
    };
  },

  click: function(itemKey, e) {
    var activeClass = 'is-selected';
    var previous    = document.querySelector('.tab' + '.' + activeClass);
    var current     = e.target.parentNode;

    previous.classList.remove(activeClass);
    current.classList.add(activeClass);

    this.props.onClick(itemKey);
  },

  generateRows: function() {
    var props      = this.props;
    var rows       = null;
    var itemKeys   = util.keys(props.items);
    var itemChunks = util.chunkArray(itemKeys, props.rowLength);
    var tabWidth   = itemKeys.length && itemKeys.length < props.rowLength ? (100 / itemKeys.length) : (100 / props.rowLength);

    if (itemKeys) {
      rows = itemChunks.map(function(itemKeys, index) {
        var tabs = itemKeys.map(function(itemKey, index) {
          // remove border on last tab in row
          var removeBorderRight = (index + 1) * tabWidth === 100 ? {borderRight: '0'} : null;
          var activeClass       = index === 0 ? ' is-selected' : '';

          return (
            <div key={index} className={'tab' + activeClass} style={{width: tabWidth + '%'}}>
              <button className='button-block text-clip' onClick={this.click.bind(this, itemKey)} style={removeBorderRight}>{itemKey}</button>
            </div>
          );
        }, this);

        return (
          <div key={index} className='tab-row'>
            {tabs}
          </div>
        );
      }, this);
    }

    return rows;
  },

  render: function() {
    var rows = this.props.items ? this.generateRows() : null;

    return (
      <div className='tab-rows'>
        {rows}
      </div>
    );
  }
});

module.exports = Tabs;
