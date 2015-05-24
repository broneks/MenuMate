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
var gm     = require('gm');

require('node-jsx').install({ extension: '.jsx' });

var mongoose  = require('mongoose');

var config = {
  database:  require('./config/database'),
  validator: require('./config/validator')
};


//
// Config
//
app.set('env', 'dev');

app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(validator(config.validator));


//
// Image uploading
//
app.use(multer({
  dest: './public/img/uploads/',
  rename: function(fieldname, filename) {
    return filename.replace(/\W+/g, '-').toLowerCase() + '-' + Date.now();
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
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/img/favicon.ico'));


//
// Routes
//
require('./routes/routes.js')(app, router);

app.get('*',function(req, res) {
  res.redirect('/');
});


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
    }

    if (app.get('env') === 'dev') {
      output.stack = err.stack;
    }

    res.render('error', {
      title  : output.error,
      output : output
    });
});

module.exports = app;
