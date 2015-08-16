//
// Menu Routes
//

var Order = require('../models/order');

function swapDashWithSpace(str) {
  if (str) {
    return str.replace(/-/g, ' ');
  }
}

function extractMonthString(str) {
  var split;

  if (str) {
    split = str.split(' ');

    return split[0] + ' 1 ' + split[1];
  }
}

function groupAndCount(curr) {
  this[curr] = (this[curr] || 0) + 1;
}

function analyzeOrderPatterns(orders) {
  var itemsSold      = {};
  var paymentMethods = {};
  var averagePayment = orders.map(function(order) {
    return order.payment;
  }).reduce(function(prev, curr) {
    return prev + curr;
  }) / orders.length;

  orders.map(function(order) {
    return order.items;
  }).reduce(function(a, b) {
    return a.concat(b);
  }).forEach(groupAndCount, itemsSold);

  orders.map(function(order) {
    return order.method;
  }).forEach(groupAndCount, paymentMethods);

  var data = {
    quantity:  orders.length,
    itemsSold: itemsSold,
    revenue: orders.map(function(order) {
      return order.total;
    }).reduce(function(prev, curr) {
      return prev + curr;
    }),
    paymentMethods: paymentMethods,
    averagePayment: averagePayment,
  };

  return data;
}

module.exports = function(router) {

  router.route('/review/orders/general')
    .get(function(req, res) {
      Order
        .find()
        .lean()
        .sort({created: 'desc'})
        .exec(function(err, orders) {
          if (err) {
            console.log(err);
          }

          var dates = {
            latest: orders[0].created,
            oldest: orders[orders.length - 1].created,
            years:  []
          };

          orders.forEach(function(order) {
            var year = order.created.getFullYear();

            if (dates.years.indexOf(year) === -1) {
              dates.years.push(year);
            }
          });

          res.json(dates);
        });
    });

  router.route('/review/orders/months/:startDate/:endDate?')
    .get(function(req, res) {
      var params = {
        startDate: swapDashWithSpace(req.params.startDate),
        endDate:   swapDashWithSpace(req.params.endDate)
      };
      var start = extractMonthString(params.startDate);
      var end   = typeof params.endDate !== 'undefined' ? extractMonthString(params.endDate) : null;

      Order
        .find()
        .lean()
        .where('created')
          .gte(new Date(start))
          .lte(end ? new Date(end) : new Date())
        .sort({created: 'desc'})
        .exec(function(err, orders) {
          if (err) {
            console.log(err);
          }

          var data = analyzeOrderPatterns(orders);

          res.json(data);
        });

    });

  router.route('/review/orders/dates/:startDate/:endDate?')
    .get(function(req, res) {
      var params = {
        startDate: swapDashWithSpace(req.params.startDate),
        endDate:   swapDashWithSpace(req.params.endDate)
      };

      Order
        .find()
        .lean()
        .where('created')
          .gte(new Date(params.startDate))
          .lte(params.endDate ? new Date(params.endDate) : new Date())
        .sort({created: 'desc'})
        .exec(function(err, orders) {
          if (err) {
            console.log(err);
          }

          var data = analyzeOrderPatterns(orders);

          res.json(data);
        });

    });
};
