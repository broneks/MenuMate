//
// Customer Routes
//

var Customer = require('../models/customer');

var validateCustomer = function(req) {
  // req.checkBody('name', 'name is required').notEmpty()
  //
  // req.checkBody('type', 'type is required').notEmpty();
  //
  // req.checkBody('ingredients', 'ingredients must only contain letters').optional();
  //
  // req.checkBody('description', 'description must be between 5 and 255 characters').optional().len(5, 255);
  //
  // req.checkBody('price', 'price is required').notEmpty();
  // req.checkBody('price', 'price must be a number').isNumberStr();

  // return req;
};

module.exports = function(router) {

  router.route('/customers')
    .get(function(req, res) {
      // Customer.find(function(err, customers) {
      //   if (err) res.send(err);
      //
      //   res.json(customers);
      // });
    })

    .post(function(req, res) {
      // var customer = new Customer();
      // var errors   = validateCustomer(req).validationErrors();
      //
      // if (errors) {
      //   res.status(400).send(errors);
      //   return;
      // }

      // item.name        = req.body.name;
      // item.type        = req.body.type;
      // item.ingredients = req.body.ingredients || '';
      // item.description = req.body.description || '';
      // item.image       = image || '';
      // item.price       = parseFloat(req.body.price);


      // customer.save(function(err) {
      //   if (err) res.send(err);
      //
      //   res.json({ message: 'customer created!' });
      // });
    });

  router.route('/customers/:customer_id')
    .get(function(req, res) {
      // Customer.findById(req.params.customer_id, function(err, customer) {
      //   if (err) res.send(err);
      //
      //   res.json(customer);
      // })
    })

    .put(function(req, res) {
      // Customer.findById(req.params.customer_id, function(err, customer) {
      //   if (err) res.send(err);
      //
      //   var image = req.files.image.path.replace('public', '');
      //   var errors = validateMenuItems(req).validationErrors();
      //
      //   if (errors) {
      //     res.status(400).send(errors);
      //     return;
      //   }
      //
      //   item.name        = req.body.name;
      //   item.type        = req.body.type;
      //   item.ingredients = req.body.ingredients || '';
      //   item.description = req.body.description || '';
      //   item.image       = image || '';
      //   item.price       = parseFloat(req.body.price);
      //
      //   customer.save(function() {
      //     if (err) res.send(err);
      //
      //     res.json({ message: 'customer updated!' });
      //   });
      // });
    })

    .delete(function(req, res) {
      // Customer.remove({
      //   _id: req.params.customer_id
      // }, function(err) {
      //   if (err) res.send(err);
      //
      //   res.json({ message: 'successfully deleted customer' });
      // })
    });
};
