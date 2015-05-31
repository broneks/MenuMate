//
// Customer Routes
//

var Customer = require('../models/customer');

var validateCustomer = function(req) {
  req.checkBody('items', 'basket items are required').notEmpty();

  req.checkBody('quantities', 'item quantities are required').notEmpty();

  req.checkBody('total', 'price is required').notEmpty();
  req.checkBody('total', 'price must be a number').isNumberStr();

  req.checkBody('status', 'status must only contain letters').optional().isAlpha();

  req.checkBody('method', 'method must only contain letters').optional().isAlpha();

  req.checkBody('postal', 'postal code must be in the format of M1M 1M1').optional().isPostal();

  req.checkBody('email', 'email must be in the right format').optional().isEmail();

  return req;
};

module.exports = function(router) {

  router.route('/customers')
    .get(function(req, res) {
      Customer
        .find()
        .lean()
        .populate('items')
        .exec(function(err, docs) {
          if (err) res.send(err);

          var options = {
            path:  'items.category',
            model: 'Category'
          };

          Customer.populate(docs, options, function(err, customers) {
            res.json(customers);
          });
        });
    })

    .post(function(req, res) {
      var customer = new Customer();
      var errors   = validateCustomer(req).validationErrors();

      if (errors) {
        res.status(400).json({ 'errors': errors });
        return;
      }

      customer.items      = req.body.items;
      customer.quantities = req.body.quantities;
      customer.total      = req.body.total;
      customer.method     = req.body.method || '';
      customer.postal     = req.body.postal || '';
      customer.email      = req.body.email  || '';

      if (req.body.status) {
        customer.status = req.body.status;
      }

      customer.save(function(err, customer) {
        if (err) res.send(err);

        res.json({
          message: 'customer created',
          context: {
            id: customer._id
          }
        });
      });
    });

  router.route('/customers/:customer_id')
    .get(function(req, res) {
      Customer
        .findById(req.params.customer_id)
        .lean()
        .populate('items')
        .exec(function(err, doc) {
          if (err) res.send(err);

          var options = {
            path:  'items.category',
            model: 'Category'
          };

          Customer.populate(doc, options, function(err, customer) {
            res.json(customer);
          });
        });
    })

    .put(function(req, res) {
      Customer.findById(req.params.customer_id, function(err, customer) {
        if (err) res.send(err);

        var errors = validateMenuItems(req).validationErrors();

        if (errors) {
          res.status(400).json({ 'errors': errors });
          return;
        }

        // cannot update items or total (for now)
        //
        // customer.items      = req.body.items;
        // customer.quantities = req.body.quantities;
        // customer.total      = req.body.total
        customer.method = req.body.method || '';
        customer.postal = req.body.postal || '';
        customer.email  = req.body.email  || '';

        if (req.body.status) {
          customer.status = req.body.status;
        }

        customer.save(function() {
          if (err) res.send(err);

          res.json({ message: 'customer updated' });
        });
      });
    })

    .delete(function(req, res) {
      // Customer.findById(req.params.customer_id, function(err, customer) {
      //   if (err) res.send(err);
      //
      //   customer.status = 'cancelled';
      //
      //   customer.save(function() {
      //     if (err) res.send(err);
      //
      //     res.json({ message: 'customer deleted' });
      //   });
      // });

      Customer.remove({
        _id: req.params.customer_id
      }, function(err) {
        if (err) res.send(err);

        res.json({ message: 'customer deleted' });
      })
    });
};
