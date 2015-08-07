//
// Order Routes
//

var Order = require('../models/order');

var validateOrder = function(req) {
  // req.checkBody('quantities', 'item quantities are required').notEmpty();
  // req.checkBody('total', 'price is required').notEmpty();
  // req.checkBody('total', 'price must be a number').isNumberStr();

  req.checkBody('items', 'basket items are required').notEmpty();

  return req;
};

var validateOrderUpdate = function(req) {
  // req.checkBody('status', 'status must only contain letters').optional().isAlpha();
  // req.checkBody('method', 'method must only contain letters').optional().isAlpha();
  // req.checkBody('payment', 'payment must be a number').optional().isNumberStr();
  // req.checkBody('change', 'change must be a number').optional().isNumberStr();

  req.checkBody('postal', 'postal code must be in the format of M1M1M1').optional().isPostal();
  req.checkBody('email', 'email must be in the right format').optional().isEmail();

  return req;
};

module.exports = function(router) {

  router.route('/orders')
    .get(function(req, res) {
      Order
        .find()
        .lean()
        .sort({ created: 'desc' })
        .populate('items')
        .exec(function(err, docs) {
          if (err) res.send(err);

          var options = {
            path:  'items.category',
            model: 'Category'
          };

          Order.populate(docs, options, function(err, orders) {
            res.json(orders);
          });
        });
    })

    .post(function(req, res) {
      var order  = new Order();
      var errors = validateOrder(req).validationErrors();

      if (errors) {
        res.status(422).json({ 'errors': errors });
        return;
      }

      order.items      = req.body.items;
      order.quantities = req.body.quantities;
      order.total      = req.body.total;
      order.method     = req.body.method  || '';
      order.payment    = req.body.payment || 0;
      order.change     = req.body.change  || 0;
      order.postal     = req.body.postal  || '';
      order.email      = req.body.email   || '';

      if (req.body.status) {
        order.status = req.body.status;
      }

      order.save(function(err, order) {
        if (err) res.send(err);

        res.json({
          message: 'order created',
          context: {
            id: order._id
          }
        });
      });
    });

  router.route('/orders/pending')
    .get(function(req, res) {
      Order
        .find()
        .lean()
        .where('status').equals('pending')
        .sort({ created: 'desc' })
        .populate('items')
        .exec(function(err, docs) {
          if (err) res.send(err);

          var options = {
            path:  'items.category',
            model: 'Category'
          };

          Order.populate(docs, options, function(err, orders) {
            res.json(orders);
          });
        });
    });

  router.route('/orders/paid')
    .get(function(req, res) {
      Order
        .find()
        .lean()
        .where('status').equals('paid')
        .sort({ updated: 'desc' })
        .populate('items')
        .exec(function(err, docs) {
          if (err) res.send(err);

          var options = {
            path:  'items.category',
            model: 'Category'
          };

          Order.populate(docs, options, function(err, orders) {
            res.json(orders);
          });
        });
    });

  router.route('/orders/cancelled')
    .get(function(req, res) {
      Order
        .find()
        .lean()
        .where('status').equals('cancelled')
        .sort({ created: 'desc' })
        .populate('items')
        .exec(function(err, docs) {
          if (err) res.send(err);

          var options = {
            path:  'items.category',
            model: 'Category'
          };

          Order.populate(docs, options, function(err, orders) {
            res.json(orders);
          });
        });
    });

  router.route('/orders/:order_id')
    .get(function(req, res) {
      Order
        .findById(req.params.order_id)
        .lean()
        .populate('items')
        .exec(function(err, doc) {
          if (err) res.send(err);

          var options = {
            path:  'items.category',
            model: 'Category'
          };

          Order.populate(doc, options, function(err, order) {
            res.json(order);
          });
        });
    })

    .put(function(req, res) {
      Order.findById(req.params.order_id, function(err, order) {
        var errors = validateOrderUpdate(req).validationErrors();

        if (err) res.send(err);

        // cannot edit 'paid' or 'cancelled' orders
        if (order.status !== 'pending') return;

        if (errors) {
          res.status(422).json({ 'errors': errors });
          return;
        }

        // cannot update items, quantites or total (for now)
        //
        // order.items      = req.body.items;
        // order.quantities = req.body.quantities;
        // order.total      = req.body.total
        order.method  = req.body.method || '';
        order.postal  = req.body.postal || '';
        order.email   = req.body.email  || '';
        order.updated = Date.now();

        if (req.body.status) {
          order.status = req.body.status;
        }
        if (req.body.payment) {
          order.payment = req.body.payment;
        }
        if (req.body.change) {
          order.change = req.body.change;
        }

        order.save(function() {
          if (err) res.send(err);

          res.json({ message: 'order updated' });
        });
      });
    })

    .delete(function(req, res) {
      // Order.findById(req.params.order_id, function(err, order) {
      //   if (err) res.send(err);
      //
      //   order.status = 'cancelled';
      //
      //   order.save(function() {
      //     if (err) res.send(err);
      //
      //     res.json({ message: 'order deleted' });
      //   });
      // });

      Order.remove({
        _id: req.params.order_id
      }, function(err) {
        if (err) res.send(err);

        res.json({ message: 'order deleted' });
      });
    });
};
