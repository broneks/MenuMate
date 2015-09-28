//
// Menu Routes
//

var Order = require('../models/order');

var reviewHelpers = require('./review-helpers.js')


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
        startDate: reviewHelpers.swapDashWithSpace(req.params.startDate),
        endDate:   reviewHelpers.swapDashWithSpace(req.params.endDate)
      };

      var startDate = new Date(params.startDate);
      var endDate   = params.endDate ? new Date(params.endDate) : new Date();

      Order
        .find()
        .lean()
        .where({status: 'paid'})
        .where('created')
          .gte(startDate)
          .lte(endDate)
        .populate('items')
        .sort({created: 'desc'})
        .exec(function(err, orders) {
          if (err) {
            console.log(err);
          }

          var data = reviewHelpers.analyzeOrderPatterns(orders);

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
        startDate: reviewHelpers.swapDashWithSpace(req.params.startDate),
        endDate:   reviewHelpers.swapDashWithSpace(req.params.endDate)
      };

      var startDate = new Date(params.startDate);
      var endDate   = params.endDate ? new Date(params.endDate) : new Date();
      var aggregate = reviewHelpers.getAggregateDateInfo(params);

      Order
        .aggregate([
          {
            $match: {
              $and: [
                {status: 'paid'},
                {created: {$gte: startDate}},
                {created: {$lte: endDate}}
              ]
            }
          },
          {
            $sort: { created: -1 }
          },
          {
            $project: aggregate.project
          },
          {
            $group: {
              _id: aggregate.group,
              count: { $sum: 1 }
            }
          }
        ], function(err, traffic) {
          var data;

          if (err) {
            console.log(err);
          } else {
            if (!traffic || !traffic.length) {
              res.json({ 'message': 'No traffic info was retrieved' });
            } else {
              data = {
                meta: reviewHelpers.getTrafficMetaInfo(traffic),
                data: traffic
              }
              res.json(data);
            }
          }
        });
    });
};
