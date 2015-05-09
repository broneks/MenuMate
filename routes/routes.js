//
// Routes
//

var MenuItem = require('../models/menu-item');

var validateMenuItems = function(req) {
  req.checkBody('name', 'name is required').notEmpty()
  req.checkBody('name', 'name must only contain letters').isAlpha();

  req.checkBody('description', 'description must be between 5 and 255 characters').optional().len(5, 255);

  req.checkBody('price', 'price is required').notEmpty();
  req.checkBody('price', 'price must be a number').isNumberStr();

  return req;
};

var React    = require('react');
var ReactApp = React.createFactory(require('../app/components/App.jsx'));

module.exports = function(app, router) {
  //
  //  React App
  //
  app.get('/', function(req, res) {
    var reactHtml = React.renderToString(ReactApp({}));

    res.render('index', { reactOutput: reactHtml });
  });


  //
  // Rest API
  //
  router.route('/menu-items')
    .get(function(req, res) {
      MenuItem.find(function(err, items) {
        if (err) res.send(err);

        res.json(items);
      });
    })

    .post(function(req, res) {
      var item   = new MenuItem();
      var errors = validateMenuItems(req).validationErrors();

      if (errors) {
        res.status(400).send(errors);
        return;
      }

      item.name        = req.body.name;
      item.description = req.body.description || '';
      item.price       = parseFloat(req.body.price);

      item.save(function(err) {
        if (err) res.send(err);

        res.json({ message: 'MenuItem created!' });
      });
    });

  router.route('/menu-items/:item_id')
    .get(function(req, res) {
      MenuItem.findById(req.params.item_id, function(err, item) {
        if (err) res.send(err);

        res.json(item);
      })
    })

    .put(function(req, res) {
      MenuItem.findById(req.params.item_id, function(err, item) {
        if (err) res.send(err);

        var errors = validateMenuItems(req).validationErrors();

        if (errors) {
          res.status(400).send(errors);
          return;
        }

        item.name        = req.body.name;
        item.description = req.body.description || '';
        item.price       = parseFloat(req.body.price);

        item.save(function() {
          if (err) res.send(err);

          res.json({ message: 'MenuItem updated!' });
        });
      });
    })

    .delete(function(req, res) {
      MenuItem.remove({
        _id: req.params.item_id
      }, function(err, bear) {
        if (err) res.send(err);

        res.json({ message: 'Successfully deleted' });
      })
    });

  // route prefix
  app.use('/api', router);
};