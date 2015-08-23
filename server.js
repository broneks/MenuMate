//
// App
//

var express = require('express');
var app     = express();
var router  = express.Router();
var jade    = require('jade');

var path         = require('path');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var validator    = require('express-validator');
var favicon      = require('serve-favicon');

var multer = require('multer');
var gm     = require('gm').subClass({ imageMagick: true });

var expressSession = require('express-session');
var passport       = require('passport');

var mongoose  = require('mongoose');

var config = {
  app:       require('./config/app.json'),
  database:  require('./config/database'),
  validator: require('./config/validator')
};

require('node-jsx').install({ extension: '.jsx' });


//
// Config
//
app.set('mode', process.env.MODE || 'common');

app.use(logger(app.get('mode')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(validator(config.validator));


//
// Image uploading
//
app.use(multer({
  dest: './public/img/uploads/',
  limits: {
    files: 1
  },
  rename: function(fieldname, filename) {
    return filename.replace(/\W+/g, '-').toLowerCase() + '-' + Date.now();
  },
  onFileUploadStart: function(file) {
    if (file.mimetype !== 'image/jpg' &&
        file.mimetype !== 'image/jpeg' &&
        file.mimetype !== 'image/png') {
      return false
    }
  },
  onFileUploadComplete: function(file) {
    var dest = this.dest;

    gm(file.path)
      .noProfile()
      .resize('200^', '125^')
      .gravity('center')
      .crop(200, 125)
      .write(dest + file.name, function() {});
  }
}));


//
// Database
//
mongoose.connect(config.database.url);


//
// Views and static files
//
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/img/favicon.ico'));


//
// Passport
//
app.use(expressSession({
  name:   'connect',
  secret: 'Love electricity shockwave central',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


//
// Routes
//
require('./routes/routes.js')(app, router, config.app);


//
// Error Handlers
//
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    var output = {
      message: err.message,
      error: err.status || 500
    };

    if (app.get('mode') === 'dev') {
      output.stack = err.stack;
    }

    res.render('error', {
      title:  output.error,
      output: output
    });
});

module.exports = app;
