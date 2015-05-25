//
// Menu Routes
//

var Category = require('../models/category');

var validateCategory = function(req) {
  req.checkBody('name', 'name is required').notEmpty();

  return req;
};

module.exports = function(router) {

  router.route('/categories')
    .get(function(req, res) {
      Category.find(function(err, categories) {
        if (err) res.send(err);

        res.json(categories);
      });
    })

    .post(function(req, res) {
      var category = new Category();
      var errors   = validateCategory(req).validationErrors();

      if (errors) {
        res.status(400).send(errors);
        return;
      }

      category.name = req.body.name;

      category.save(function(err) {
        if (err) res.send(err);

        res.json({ message: 'category created!' });
      });
    });

  router.route('/categories/:category_id')
    .get(function(req, res) {
      Category.findById(req.params.category_id, function(err, category) {
        if (err) res.send(err);

        res.json(category);
      })
    })

    .put(function(req, res) {
      Category.findById(req.params.category_id, function(err, category) {
        if (err) res.send(err);

        var errors = validateCategory(req).validationErrors();

        if (errors) {
          res.status(400).send(errors);
          return;
        }

        category.name    = req.body.name;
        category.updated = Date.now();

        category.save(function() {
          if (err) res.send(err);

          res.json({ message: 'category updated!' });
        });
      });
    })

    .delete(function(req, res) {
      Category.remove({
        _id: req.params.category_id
      }, function(err) {
        if (err) res.send(err);

        res.json({ message: 'successfully deleted category' });
      })
    });
};
