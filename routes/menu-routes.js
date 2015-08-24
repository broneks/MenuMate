//
// Menu Routes
//

var MenuItem = require('../models/menu-item');


module.exports = function(router) {

  router.route('/menu-items')
    .get(function(req, res) {
      MenuItem
        .find()
        .lean()
        .where({onsale: true})
        .sort({'name': 'asc'})
        .populate('category')
        .exec(function (err, items) {
          if (err) res.send(err);

          res.json(items);
        });
    });

  router.route('/by-category/menu-items')
    .get(function(req, res) {
      MenuItem
        .find()
        .lean()
        .where({onsale: true})
        .sort({'name': 'asc'})
        .populate('category')
        .exec(function (err, items) {
          if (err) res.send(err);

          var itemsByCategory = {};

          items.forEach(function(item) {
            var name = item.category.name;

            if (!itemsByCategory[name]) {
              itemsByCategory[name] = [];
            }
            itemsByCategory[name].push(item);
          });

          res.json(itemsByCategory);
        });
    });
};
