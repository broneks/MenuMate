//
// Menu Routes
//

var Customer = require('../models/customer');
var Loyalty  = require('../models/loyalty');

var TAX = require('../config/app.json').tax;


var getMonthName = (function() {
  var months = 'Jan Feb Mar Apr May June July Aug Sept Oct Nov Dec'.split(' ');

  return function(num) {
    if (num) {
      return months[num];
    }
  };
})();

var validateNewCustomer = function(req) {
  req.checkBody('code', 'loyalty code is required').notEmpty();

  if (req.body.code) {
    req.checkBody('code', 'loyalty code must be in the format of 123ABC').isCode();
  }

  if (req.body.postal) {
    req.checkBody('postal', 'postal code must be in the format of M1M1M1').isPostal();
  } else {
    req.checkBody('postal', 'postal code is required').notEmpty();
  }

  return req;
};

var validateCustomer = function(req) {
  req.checkBody('code', 'loyalty code is required').notEmpty();

  if (req.body.code) {
    req.checkBody('code', 'loyalty code must be in the format of 123ABC').isCode();
  }

  return req;
};

var validateLoyalty = function(req) {
  var now = new Date();

  req.checkBody('name', 'name is required').notEmpty();
  req.checkBody('reward', 'reward amount is required').notEmpty();
  req.checkBody('goal', 'spending goal amount is required').notEmpty();
  req.checkBody('startdate', 'start date is required').notEmpty();

  if (req.body.reward) {
    req.checkBody('reward', 'reward amount must be a number').isNumberStr();
  }
  if (req.body.goal) {
    req.checkBody('goal', 'spending goal amount must be a number').isNumberStr();
  }
  if (req.body.startdate) {
    req.checkBody('startdate', 'start date must be in the format of "' + getMonthName(now.getMonth()) + ' ' + now.getDate() + ' ' + now.getFullYear() + '"').isDate();
  }
  if (req.body.description) {
    req.checkBody('description', 'description must be between 5 and 255 characters').len(5, 255);
  }

  return req;
};

var calculateCustomerReward = function(loyalty, customer, order) {
  var loyaltyDate  = Date.parse(loyalty.startdate);
  var lastReward   = !isNaN(Date.parse(customer.lastreward)) ? Date.parse(customer.lastreward) : 0;
  var cutOffDate   = Math.max(loyaltyDate, lastReward);
  var rewardsClone = JSON.parse(JSON.stringify(customer.rewards));;
  var now          = new Date();
  var totalSpent;

  if (!customer.orders.length) return;

  // if previous rewards remain in customer's wallet
  // then the amount must be used up before they re-enter
  // the loyalty reward process
  if (customer.rewards.wallet) {
    rewardsClone[order.id] = {
      type:   'left over from previous reward',
      reward: customer.rewards.wallet,
      date:   now
    };

    customer.rewards    = rewardsClone;
    customer.lastreward = now;

    return;
  }

  totalSpent = customer.orders
    .filter(function(o) {
      return (Date.parse(o.created) > cutOffDate) && (typeof o.total !== 'undefined');
    })
    .map(function(o) { return o.total * TAX; })
    .reduce(function(a, b) {
      return a + b;
    }, 0);

  totalSpent += order.total * TAX;

  if (totalSpent >= loyalty.goal) {
    rewardsClone.wallet += loyalty.reward;
    rewardsClone[order.id] = {
      type:   loyalty.name,
      reward: loyalty.reward,
      date:   now
    };

    customer.rewards    = rewardsClone;
    customer.lastreward = now;
  }
};


module.exports = function(router) {

  router.route('/loyalty')
    .get(function(req, res) {
      Loyalty
        .findOne()
        .lean()
        .exec(function(err, loyalty) {
          if (err) {
            res.send(err);
          } else {
            res.json(loyalty);
          }
        });
    })

    .post(function(req, res) {
      var loyalty = new Loyalty();
      var errors   = validateLoyalty(req).validationErrors();

      if (errors) {
        res.status(422).json({ 'errors': errors });
        return;
      }

      loyalty.name        = req.body.name;
      loyalty.reward      = req.body.reward;
      loyalty.goal        = req.body.goal;
      loyalty.startdate   = req.body.startdate;
      loyalty.description = req.body.description || '';


      loyalty.save(function(err) {
        if (err) {
          res.json({ message: 'loyalty reward could not be created. please try again.' });
        } else {
          res.json({ message: 'loyalty reward created' });
        }
      });
    })

  router.route('/loyalty/:id')
    .put(function(req, res) {
      Loyalty.findById(req.params.id, function(err, loyalty) {
        if (err) res.send(err);

        var errors = validateLoyalty(req).validationErrors();

        if (errors) {
          res.status(422).json({ 'errors': errors });
          return;
        }

        loyalty.name      = req.body.name;
        loyalty.reward    = req.body.reward;
        loyalty.startdate = req.body.startdate;
        loyalty.goal      = req.body.goal;
        loyalty.updated   = Date.now();

        if (req.body.description) {
          loyalty.description = req.body.description;
        }

        loyalty.save(function() {
          if (err) {
            res.json({ message: 'loyalty reward could not be updated. please try again.' });
          } else {
            res.json({ message: 'loyalty reward updated' });
          }
        });
      });
    });

  router.route('/customers')
    .get(function(req, res) {
      Customer
        .find()
        .lean()
        .populate('orders')
        .sort({'created': 'desc'})
        .exec(function(err, customers) {
          if (err) {
            res.send(err);
          } else {
            res.json(customers);
          }
        });
    })

    .post(function(req, res) {
      var customer = new Customer();
      var errors   = validateNewCustomer(req).validationErrors();

      if (errors) {
        res.status(422).json({ 'errors': errors });
        return;
      }

      customer.code   = req.body.code;
      customer.postal = req.body.postal;
      customer.name   = req.body.name || '';
      customer.orders = [req.body.order.id];


      customer.save(function(err) {
        if (err) {
          res.json({ message: 'customer could not be created. please try again.' });
        } else {
          res.json({
            message: 'customer created',
            context: {
              customer: customer
            }
          });
        }
      });
    });

  router.route('/customers/:customer_id')
    .get(function(req, res) {
      Customer
        .findById(req.params.customer_id)
        .lean()
        .populate('orders')
        .exec(function(err, customer) {
          if (err) {
            res.send(err);
          } else {
            res.json(customer);
          }
        });
    });

  router.route('/by-order/customers/:order_id')
    .get(function(req, res) {
      Customer
        .findOne({'orders': {$in: [req.params.order_id]}})
        .populate('orders')
        .lean()
        .exec(function(err, customer) {
          if (err) {
            res.send(err);
          } else {
            res.json(customer);
          }
        });
    })

    .put(function(req, res) {
      Customer
        .findOne({'orders': {$in: [req.params.order_id]}})
        .exec(function(err, customer) {
          var rewardsClone;

          if (err) {
            res.send(err);
          } else {
            rewardsClone = JSON.parse(JSON.stringify(customer.rewards));
            rewardsClone.wallet = req.body.wallet;

            customer.rewards = rewardsClone;

            customer.save(function() {
              res.json(customer);
            });
          }
        });
    })

  router.route('/by-code/customers/:customer_code')
    .get(function(req, res) {
      Customer
        .findOne({code: req.params.customer_code})
        .populate('orders')
        .lean()
        .exec(function(err, customer) {
          if (err) {
            res.send(err);
          } else {
            res.json(customer);
          }
        });
    })

    .put(function(req, res) {
      Customer
        .findOne({code: req.params.customer_code})
        .populate('orders')
        .exec(function(err, customer) {
          if (err) res.send(err);

          var errors = validateCustomer(req).validationErrors();

          if (errors) {
            res.status(422).json({ 'errors': errors });
            return;
          } else if (!customer) {
            res.json({ 'message': 'customer could not be found. please try again.'});
            return;
          }

          customer.orders.push(req.body.order.id);

          Loyalty
            .findOne()
            .lean()
            .exec(function(err, loyalty) {
              if (loyalty) {
                calculateCustomerReward(loyalty, customer, req.body.order);
              }

              customer.save(function() {
                res.json(customer);
              });
            });
          });
    });
};
