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
  console.log(req.body.EMAIL);
  console.log(req.body.FNAME);
  console.log(req.body.LNAME);
  console.log(req.body.MMERGE3);
  var cmdStr = 'mail -s "Contact Us Form" service@my-eyecare.com <<< "Message:  '+req.body.MMERGE3+'    Firstname: '+req.body.FNAME+'  Lastname:'+req.body.LNAME+'   Email: '+req.body.EMAIL+'" ';

  console.log(cmdStr);

  var temp = process.env,
      environment = {};
  environment.PATH = temp.PATH+":/usr/local/node/bin";
  var option = {
    env: environment,
    shell: "/bin/bash",
  }

  var exec = require('child_process').exec;
  exec(cmdStr, option, function(err,stdout,stderr){
    if(err) {
      res.send('Got a POST request');
      console.log('mail to contactus fail:'+stderr);
    } else {
      res.send('Got a POST request');
      console.log('mail to contactus success');
    }
  });

});

// 网站注册POST 请求
app.post('/register', function (req, res) {
  console.log(req.body.email);
  console.log(req.body.password);

  AWSCognito.config.region = 'us-west-2'; //This is required to derive the endpoint
  var poolData = {
    UserPoolId : 'us-west-2_Fojm1h58P',
    ClientId : '74odl2a2sbqmfckafmrpfh1c8t'
  };
  var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

  var attributeList = [];

  var dataEmail = {
    Name : 'email',
    Value : 'email@mydomain.com'
  };
  var dataPhoneNumber = {
    Name : 'phone_number',
    Value : '+15555555555'
  };
  var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);
  var attributePhoneNumber = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataPhoneNumber);

  attributeList.push(attributeEmail);
  attributeList.push(attributePhoneNumber);

  userPool.signUp('username', 'password', attributeList, null, function(err, result){
    if (err) {
      alert(err);
      return;
    }
    cognitoUser = result.user;n
    console.log('user name is ' + cognitoUser.getUsername());
  });

});

// 网站登陆 POST 请求
app.post('/logon', function (req, res) {
  console.log(req.body.email);
  console.log(req.body.password);

  var authenticationData = {
    Username : 'username',
    Password : 'password',
  };
  var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
  var poolData = { UserPoolId : 'us-east-1_TcoKGbf7n',
    ClientId : '4pe2usejqcdmhi0a25jp4b5sh3'
  };
  var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
  var userData = {
    Username : 'username',
    Pool : userPool
  };
  var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      console.log('access token + ' + result.getAccessToken().getJwtToken());
      /*Use the idToken for Logins Map when Federating User Pools with Cognito Identity or when passing through an Authorization Header to an API Gateway Authorizer*/
      console.log('idToken + ' + result.idToken.jwtToken);
    },

    onFailure: function(err) {
      alert(err);
    },

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
