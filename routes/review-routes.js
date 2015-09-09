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
    paymentMethods: paymentMethods
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

      var startDate = new Date(params.startDate);
      var endDate   = params.endDate ? new Date(params.endDate) : new Date();

      Order
        .find()
        .lean()
        .where({status: 'paid'})
        .where('updated')
          .gte(startDate)
          .lte(endDate)
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
            res.json({ 'message': 'No orders were retrieved' });
          }
        });
    });

  router.route('/review/traffic/dates/:startDate/:endDate?')
    .get(function(req, res) {
      var params = {
        startDate: swapDashWithSpace(req.params.startDate),
        endDate:   swapDashWithSpace(req.params.endDate)
      };

      var startDate = new Date(params.startDate);
      var endDate   = params.endDate ? new Date(params.endDate) : new Date();

      Order
        .aggregate([
          {
            $match: {
              $and: [
                {status: 'paid'},
                {updated: {$gte: startDate}},
                {updated: {$lte: endDate}}
              ]
            }
          },
          {
            $sort: { created: 1 }
          },
          {
            $project: {
              year:  { $year:       "$created" },
              month: { $month:      "$created" },
              day:   { $dayOfMonth: "$created" },
              hour:  { $hour:       "$created" }
            }
          },
          {
            $group: {
              _id: {
                year:  "$year",
                month: "$month",
                day:   "$day"
              },
              count: { $sum: 1 }
            }
          }

        ], function(err, traffic) {
          if (err) {
            console.log(err);
          } else {
            if (!traffic || !traffic.length) {
              res.json({ 'message': 'No traffic info was retrieved' });
            } else {
              res.json(traffic);
            }
          }
        });
    });
};
