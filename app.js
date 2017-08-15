var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);


// 网站首页接受 POST 请求
app.post('/contactus', function (req, res) {
  res.send('Got a POST request');
  console.log(req.body.EMAIL);
  console.log(req.body.FNAME);
  console.log(req.body.LNAME);
  console.log(req.body.MMERGE3);

  var exec = require('child_process').exec;
  var cmdStr = 'mail -s "'+req.body.FNAME+"-"+req.body.LNAME+'" service@my-eyecare.com <<< "'+req.body.MMERGE3+req.body.EMAIL+'" ';
  console.log(cmdStr);
  exec(cmdStr, function(err,stdout,stderr){
    if(err) {
      console.log('mail to contactus fail:'+stderr);
    } else {
      console.log('mail to contactus success');
    }
  });

});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
