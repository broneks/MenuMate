//
// API Endpoints
//

var app  = require('../../config/app.json');
var base = app.url.host + '/api/';

module.exports = {
  menuItems: {
    standard:   base + 'menu-items/',
    byCategory: base + 'by-category/menu-items/'
  },
  customers:  {
    standard: base + 'customers/',
    byOrder:  base + 'by-order/customers/',
    byCode:   base + 'by-code/customers/'
  },
  loyalty:    base + 'loyalty/',
  categories: base + 'categories/',
  orders:     base + 'orders/',
  pending:    base + 'orders/pending/',
  paid:       base + 'orders/paid/',
  review: {
    orders: {
      general:    base + 'review/orders/general/',
      dateRange:  base + 'review/orders/dates/'
    },
    traffic: base + 'traffic/orders/dates/'
  },
  manage: {
    menuItems: {
      standard:   base + 'manage/menu-items/',
      byCategory: base + 'manage/by-category/menu-items/'
    }
  },
  auth: {
    isAuthenticated: base + 'auth/is-authenticated',
    login:           base + 'auth/login',
    logout:          base + 'auth/logout'
  }
};
