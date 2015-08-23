var passport = require('passport');
var Strategy = require('passport-local').Strategy;

var User = require('../models/user');

passport.use(new Strategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var validateUser = function(req) {
  req.checkBody('username', 'username is required').notEmpty()
  req.checkBody('password', 'password is required').notEmpty();
  // req.checkBody('email', 'email is required').notEmpty();
  //
  // if (req.body.email) {
  //   req.checkBody('email', 'email must be in the right format of abc@email.com').isEmail();
  // }

  return req;
};

module.exports = function(router) {
  router.route('/auth/is-authenticated')
    .get(function(req, res) {
      if (req.isAuthenticated()) {
        res.send(true);
      } else {
        res.send(false);
      }
    });

  router.route('/auth/login')
    .post(function(req, res) {
      var errors = validateUser(req).validationErrors();

      if (errors) {
        res.status(422).json({ 'errors': errors });
        return;
      }

      passport.authenticate('local', function(err, user) {
        if (err) {
          console.log(err);
        }

        var errors = [
          {error: 'login failed – please try again'}
        ];
        var authenticated = false;

        if (user) {
          req.logIn(user, function() {});
          errors        = [];
          authenticated = true;
        }

        res.json({
          errors:        errors,
          authenticated: authenticated
        });
      })(req, res);
    });

  router.route('/auth/logout')
    .get(function(req, res) {
      req.logout();
      req.session.destroy();
      res.end();
    });
};
