//
// API Endpoints
//

var host = 'localhost:3000';
var base = 'http://' + host + '/api/';

module.exports = {
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
