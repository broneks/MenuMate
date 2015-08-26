//
// Menu Routes
//

var Category = require('../models/category');
var MenuItem = require('../models/menu-item');

var validateCategory = function(req) {
  req.checkBody('name', 'name is required').notEmpty();

  return req;
};

module.exports = function(router) {

  router.route('/categories')
    .get(function(req, res) {
      Category
        .find()
        .lean()
        .sort('name')
        .exec(function(err, categories) {
          if (err) {
            res.send(err);
          } else {
            res.json(categories);
          }
        });
    })

    .post(function(req, res) {
      var category = new Category();
      var errors   = validateCategory(req).validationErrors();

      if (errors) {
        res.status(422).json({ 'errors': errors });
        return;
      }

      category.name = req.body.name;

      category.save(function(err) {
        if (err) {
          res.json({ message: 'category could not be created. please try again.' });
        } else {
          res.json({ message: 'category created' });
        }
      });
    });

  router.route('/categories/:category_id')
    .get(function(req, res) {
      Category
        .findById(req.params.category_id)
        .lean()
        .exec(function(err, category) {
          if (err) {
            res.send(err);
          } else {
            res.json(category);
          }
        });
    })

    .put(function(req, res) {
      Category.findById(req.params.category_id, function(err, category) {
        if (err) res.send(err);

        var errors = validateCategory(req).validationErrors();

        if (errors) {
          res.status(422).json({ 'errors': errors });
          return;
        }

        category.name    = req.body.name;
        category.updated = Date.now();


        category.save(function() {
          if (err) {
            res.json({ message: 'category could not be updated. please try again.' });
          } else {
            res.json({ message: 'category updated' });
          }
        });
      });
    })

    .delete(function(req, res) {
      // MenuItem.count({
      //   category: req.params.category_id
      // }, function (err, count) {
      //   if (count) {
      //     if (err) res.send(err);
      //
      //     res.status(400).send({ message: 'cannot delete a category that being' +
      //     'used in the menu. Remove all assignments before continuing.' });
      //   } else {
      //     Category.remove({
      //       _id: req.params.category_id
      //     }, function(err) {
      //       if (err) res.send(err);
      //
      //       res.json({ message: 'category deleted' });
      //     })
      //   }
      // });

    });
};
