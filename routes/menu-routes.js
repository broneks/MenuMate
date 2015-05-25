//
// Menu Routes
//

var MenuItem = require('../models/menu-item');

var validateMenuItems = function(req) {
  req.checkBody('name', 'name is required').notEmpty()

  req.checkBody('category', 'category is required').notEmpty();

  req.checkBody('ingredients', 'ingredients must be between 5 and 255 characters').optional().len(5, 255);

  req.checkBody('description', 'description must be between 5 and 255 characters').optional().len(5, 255);

  req.checkBody('price', 'price is required').notEmpty();
  req.checkBody('price', 'price must be a number').isNumberStr();

  return req;
};

module.exports = function(router) {

  router.route('/menu-items')
    .get(function(req, res) {
      MenuItem
        .find()
        .populate('category')
        .exec(function (err, items) {
          if (err) res.send(err);

          res.json(items);
        });
    })

    .post(function(req, res) {
      console.log(req.files);

      var item   = new MenuItem();
      var errors = validateMenuItems(req).validationErrors();

      if (errors) {
        res.status(400).send(errors);
        return;
      }

      if (req.files.image) {
        item.image = req.files.image.path.replace('public', '');
      }

      item.name        = req.body.name;
      item.category    = req.body.category;
      item.ingredients = req.body.ingredients || '';
      item.description = req.body.description || '';
      item.price       = parseFloat(req.body.price);


      item.save(function(err) {
        if (err) res.send(err);

        res.json({ message: 'menu item created!' });
      });
    });

  router.route('/menu-items/:item_id')
    .get(function(req, res) {
      MenuItem
        .findById(req.params.item_id)
        .populate('category')
        .exec(function(err, item) {
          if (err) res.send(err);

          res.json(item);
        });
    })

    .put(function(req, res) {
      MenuItem.findById(req.params.item_id, function(err, item) {
        if (err) res.send(err);

        var errors = validateMenuItems(req).validationErrors();

        if (errors) {
          res.status(400).send(errors);
          return;
        }

        if (req.files.image) {
          item.image = req.files.image.path.replace('public', '');
        }

        item.name        = req.body.name;
        item.category    = req.body.category;
        item.ingredients = req.body.ingredients;
        item.description = req.body.description;
        item.price       = parseFloat(req.body.price);
        item.updated     = Date.now();

        item.save(function() {
          if (err) res.send(err);

          res.json({ message: 'menu item updated!' });
        });
      });
    })

    .delete(function(req, res) {
      MenuItem.remove({
        _id: req.params.item_id
      }, function(err) {
        if (err) res.send(err);

        res.json({ message: 'successfully deleted menu item' });
      })
    });
};
