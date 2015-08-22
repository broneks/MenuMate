//
// API Endpoints
//

var app  = require('../../config/app.json');
var base = app.url.host + '/api/';

module.exports = {
  menuItemsByCategory: base + 'by-category/menu-items/',
  menuItems:  base + 'menu-items/',
  categories: base + 'categories/',
  orders:     base + 'orders/',
  pending:    base + 'orders/pending/',
  paid:       base + 'orders/paid/',
  review: {
    orders: {
      general:    base + 'review/orders/general/',
      dateRange:  base + 'review/orders/dates/'
    }
  }
};
