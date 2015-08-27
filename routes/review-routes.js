//
// Menu Routes
//

var Order = require('../models/order');

function swapDashWithSpace(str) {
  if (str) {
    return str.replace(/-/g, ' ');
  }
}

function groupAndCount(curr) {
  if (curr) {
    this[curr] = (this[curr] || 0) + 1;
  }
}

function groupAndCountWithId(curr) {
  var name = curr[1];

  if (!this[name])    this[name]    = {};
  if (!this[name].id) this[name].id = curr[0];

  this[name].count = (this[name].count || 0) + 1;
}


function analyzeOrderPatterns(orders) {
  if (!orders.length) return;

  var itemsSold      = {};
  var paymentMethods = {};

  var revenue = orders
    .map(function(order) {
      return order.total;
    })
    .reduce(function(prev, curr) {
      return prev + curr;
    });

  var averagePayment = orders
    .map(function(order) {
      return order.payment;
    })
    .reduce(function(prev, curr) {
      return prev + curr;
    }) / orders.length;

  var customerInfo = orders
    .filter(function(order) {
      return (order.postal || order.email);
    })
    .map(function(order) {
      return {
        postal: order.postal,
        email:  order.email
      };
    });

  // items sold
  orders
    .map(function(order) {
      return order.items
        .map(function(item) {
          return [item._id, item.name];
        })
        .forEach(groupAndCountWithId, itemsSold)
    });
  itemsSold = Object.keys(itemsSold)
    .map(function(name) {
      var obj = itemsSold[name];

      return {
        name:  name,
        count: obj.count,
        id:    obj.id
      };
    })
    .sort(function(a, b) {
      return a.count < b.count;
    });

  // payment methods
  orders
    .map(function(order) {
      return order.method;
    })
    .forEach(groupAndCount, paymentMethods);

  var data = {
    quantity:       orders.length,
    revenue:        revenue,
    averagePayment: averagePayment,
    itemsSold:      itemsSold,
    paymentMethods: paymentMethods,
    customerInfo:   customerInfo
  };

  return data;
}

module.exports = function(router) {

  router.route('/review/orders/general')
    .get(function(req, res) {
      Order
        .find()
        .lean()
        .where({status: 'paid'})
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

  router.route('/review/orders/dates/:startDate/:endDate?')
    .get(function(req, res) {
      var params = {
        startDate: swapDashWithSpace(req.params.startDate),
        endDate:   swapDashWithSpace(req.params.endDate)
      };

      Order
        .find()
        .lean()
        .where({status: 'paid'})
        .where('created')
          .gte(new Date(params.startDate))
          .lte(params.endDate ? new Date(params.endDate) : new Date())
        .populate('items')
        .sort({created: 'desc'})
        .exec(function(err, orders) {
          if (err) {
            console.log(err);
          }

          var data = analyzeOrderPatterns(orders);

          if (data) {
            res.json(data);
          } else {
            res.json({ 'message': 'No Orders Were Retrieved' });
          }
        });
    });
};
