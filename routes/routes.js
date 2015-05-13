//
// Routes
//

var MenuItem = require('../models/menu-item');

var validateMenuItems = function(req) {
  req.checkBody('name', 'name is required').notEmpty()

  req.checkBody('type', 'type is required').notEmpty();

  req.checkBody('ingredients', 'ingredients must only contain letters').optional();  

  req.checkBody('description', 'description must be between 5 and 255 characters').optional().len(5, 255);

  req.checkBody('price', 'price is required').notEmpty();
  req.checkBody('price', 'price must be a number').isNumberStr();

  return req;
};

var React  = require('react');
var Router = require('react-router');

var App    = require('../app/components/App.jsx').App;
var routes = require('../app/components/App.jsx').routes;

module.exports = function(app, router) {
  //
  //  React App
  //
  app.get('/', function(req, res) {
    Router.run(routes, req.path, function (Handler) {
      var reactHtml = React.renderToString(React.createElement(Handler));

      res.render('index', { reactOutput: reactHtml });
    });
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
      var image  = req.files.image.path.replace('public', '');
      var errors = validateMenuItems(req).validationErrors();

      if (errors) {
        res.status(400).send(errors);
        return;
      }

      item.name        = req.body.name;
      item.type        = req.body.type;
      item.ingredients = req.body.ingredients || '';
      item.description = req.body.description || '';
      item.image       = image || '';
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

        // var image = req.files.image.path.replace('public', '');
        // var errors = validateMenuItems(req).validationErrors();

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

        // item.save(function() {
        //   if (err) res.send(err);

        //   res.json({ message: 'MenuItem updated!' });
        // });
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