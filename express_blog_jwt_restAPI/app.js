var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var usersRouter = require('./routes/user');
var blogRouter = require('./routes/blog');
var oauthGitHubRouter = require('./routes/Oauth2GitHub');
var oauthGoogleRouter = require('./routes/Oauth2Google');

var cookieSession = require('cookie-session')
const { accessWriteStream, errorWriteStream, eventWriteStream } = require('./utils/log')
var jwt = require('jsonwebtoken')
const secretOrPrivateKey = 'issac77'
const secretOrPrivateKeyForCSRF = 'csrf77'

const { SuccessModel, ErrorModel } = require('./model/resModel')


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev',{
  stream: accessWriteStream
}));

app.use(logger('dev'));
//对应req.body的内容
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//跨域中间件 或者用 require('cors');
const disableCache = function(req, res, next) {
  //调试阶段，设置header告诉浏览器不要缓存http的响应，否则浏览器会到缓存里面拿，后台显示的请求为304
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate')  // HTTP 1.1
  // res.header('Pragma', 'no-cache')     //HTTP 1.0
  // res.header('Expires', '0')           //Proxies
  next()
}

app.use(disableCache);

//跨域中间件 或者用 require('cors');
const crossDomain = function(req, res, next) {
  //当需要设置cookies时 origin不能为*
  //处理跨域请求
  console.log('handle crossDomain:', req.method)
  var orginList=[
    "http://localhost:4200",
    "http://127.0.0.1:5500",
    "http://192.168.5.121:5500"
  ]
  // "http://192.168.5.121:5500"
  // 模拟局域网内客户的登录
  if(orginList.includes(req.headers.origin.toLowerCase())){
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header('Access-Control-Allow-Origin', req.headers.origin);
}
  // res.header('Access-Control-Allow-Origin', req.headers.origin)
  // res.header('Access-Control-Allow-Origin', 'http://localhost:4200')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-XSRF-TOKEN')
  res.header('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,DELETE,PUT')
  res.header('Access-Control-Allow-Credentials', true)
  //CSP Settings
  // res.header('Content-Security-Policy', "default-src 'self';")
  req.method === 'OPTIONS' ? res.status(204).end() : next()
}

app.use(crossDomain);


//处理login-session
app.use(cookieSession({
  secret: 'Dxx_766',
  name: 'in-sess',
  httpOnly: true,
    maxAge: 30 * 60 * 1000
}))


//之前： jwt-token 放在authorization
//现在： access_token 放在cookie xsrf-token 放在头部的 x-xsrf-token
//验证 jwt token
const verifyJwt = function(req, res, next) {
  console.log('verifyJwt')
  //console.log('req: ',req.headers)
  let token = req.headers.authorization;
  if (!token) {
    console.log('no have token')
    return res.json(new ErrorModel('尚未登录'))
  }
  token = token.split(" ");
  token = token.length == 1 ? token[0] : token[1];
  let payLoad;
  try{
      payLoad = jwt.verify(token, secretOrPrivateKey);
      app.set('username', payLoad.username)
      app.set('realname', payLoad.realname)
      app.set('userID', payLoad.userID)
      app.set('origin', payLoad.origin)
      if(payLoad.GitHubID ) {
        app.set('GitHubID', payLoad.GitHubID)
      }
      console.log('pass token verify, and get the user data' , payLoad)
      return next()
  } catch (e) {
      console.log('not pass token verify, and not get the user data');
        return res.json(new ErrorModel('尚未登录'))
  }
}

const verifySession = function(req, res, next) {
  console.log('verifySession')
  if(req.session?.access_token) {
    let payLoad;
    try{
        payLoad = jwt.verify(req.session.access_token, secretOrPrivateKey);
        console.log('pass token verify, and get the user data' , payLoad)
        return next()
    } catch (e) {
        console.log('not pass token verify, and not get the user data');
        return res.json(new ErrorModel('尚未登录'))
    }
  } else {
    console.log('not pass access_token verify, and not get the user data');
    return res.json(new ErrorModel('尚未登录'))
  }
}

const verifyXSRF = function(req, res, next) {
  console.log('verifyXSRF')
  let token = req.headers["x-xsrf-token"];
  if (!token) {
    console.log('no have X-XSRF-TOKEN');
    return res.status(403).send()
    //return res.json(new ErrorModel(' X-XSRF-TOKEN 不合法'))
  } else {
    token = token.split(" ");
    token = token.length == 1 ? token[0] : token[1];
    console.log("X-XSRF-TOKEN: ", token);
    try{
      payLoad = jwt.verify(token, secretOrPrivateKeyForCSRF);
      console.log('pass X-XSRF-TOKEN verify, and get the user data' , payLoad)
      return next()
  } catch (e) {
      console.log('not pass X-XSRF-TOKEN verify, and not get the user data');
      return res.json(new ErrorModel('尚未登录'))
  }
  }
}



// app.use('/', indexRouter);
app.use('/api/user', usersRouter);
app.use('/api/blog', verifySession, verifyXSRF,  blogRouter);
app.use('/oauth',  oauthGitHubRouter);
app.use('/oauth',  oauthGoogleRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log("cannot find this route");
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log('err.message: ', err.message);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
