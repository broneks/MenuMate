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

module.exports = function(router) {

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
        .exec(function(err, orders) {
          if (err) {
            console.log(err);
          }

          res.json(orders.map(function(order) {
            return order.created.getDate() + ' ' + (order.created.getMonth() + 1) + ' '  + order.created.getFullYear();
          }));
        });

    })

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
          .exec(function(err, orders) {
            if (err) {
              console.log(err);
            }

            res.json(orders.map(function(order) {
              return order.created.getDate() + ' ' + (order.created.getMonth() + 1) + ' '  + order.created.getFullYear();
            }));
          });

      })

  // router.route('/categories/:category_id')
  //   .get(function(req, res) {
  //     Category
  //       .findById(req.params.category_id)
  //       .lean()
  //       .exec(function(err, category) {
  //         if (err) res.send(err);
  //
  //         res.json(category);
  //       });
  //   })
};
