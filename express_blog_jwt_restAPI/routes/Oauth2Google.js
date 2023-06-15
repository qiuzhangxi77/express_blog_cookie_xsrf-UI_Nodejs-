var express = require('express');
var router = express.Router();
const axios = require('axios');
const {genUserID, genXSRFId} = require('../utils/cryp');
const { SuccessModel, ErrorModel } = require('../model/resModel')

const CLIENT_ID = '268444631280-cvjt1i0vaj29asbdnte8bjgqhhka4gp5.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:4005/GoogleRedirect';

var access_token = '';
var jwt = require('jsonwebtoken');
const loginNameForRegister = 'LanBlog';
const passwordForRegister = 'LanBlog';
const { isUserExists, register } = require('../controller/user');
const { bindGoogle, isGoogleOauthUserExists, GoogleOauthRegister } = require('../controller/googleUser')

const options = {
    algorithm: 'HS256',
    expiresIn: '1h'
}
const secretOrPrivateKey = 'issac77'
const secretOrPrivateKeyForCSRF = 'csrf77'


router.get('/GoogleAuthPage',function(req, res, next){ 
    console.log('GoogleAuthPage');
    let state = genUserID();
    // res.cookie('XSRF-TOKEN', state); 
    // scope=openid%20profile%20email
    // const scope = ["openid", "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"];
    // const scope = "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid";
    // const scope = "openid%20profile%20email";
    const scope = "profile email openid";
    const response_type= "code"; 
    res.send({authUrl: 'https://accounts.google.com/o/oauth2/v2/auth?client_id=' + CLIENT_ID + '&redirect_uri=' + REDIRECT_URI + 
    '&scope=' + scope + '&response_type=' + response_type + '&state=' + state }); 
})

router.post('/GoogleGetAccessToken', function(req, res, next){
    // let state = req.headers['x-xsrf-token'];
    // console.log('getAccessToken state:', state);
    console.log("req.body.code: ", req.body.code);
    // 注意需要vpn才能连接
    axios.post("https://oauth2.googleapis.com/token", {
      'code': req.body.code,
      'client_id': CLIENT_ID,
      'client_secret': CLIENT_SECRET,
      'redirect_uri': REDIRECT_URI,
      'grant_type': "authorization_code",
    })
    .then(function(resp){
      if(resp.data.access_token){
        console.log("success get access_token: ", access_token);
        // req.session.token = resp.data.access_token;
        access_token = resp.data.access_token;
      }
      // res.send(resp.data);
      //不需要传出access_token 因为验证还是用jwt生成token，即授权的时候用access token取回来的user信息注册或绑定一个账号，然后用jwt生成token
      res.status(200).send();
    })
    .catch(function(err){
      console.log("GoogleGetAccessToken err: ", err);
      res.send(err);
    })
  })

  const loginByGoogle = async function(req, res) {
    console.log("using Google login Blog");
    var oauthID = '';
    var oauth = 'Google';
    var LanBlogUser = {};
    var userID = '';
    try {
      const result =await axios({
        url:`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`,
        method:'GET',
        headers:{Authorization: `Bearer ${access_token}`}
      })
      console.log("www.googleapis.com/oauth2/v1/userinfo result: ", result.data);
      oauthID = result.data.id;
      console.log('return oauthID: ', oauthID);
      const isGoogleUserExists = await isGoogleOauthUserExists(oauthID);
      if (!isGoogleUserExists) {
        //case1 不存在，则首先注册一个本地账号并绑定
        const name = loginNameForRegister + '_' + `${Math.random()}`;
        const password = passwordForRegister + '_' + `${Math.random()}`;
        userID = genUserID();
        LanBlogUser = {
          username: name,
          password: password,
          realname: name,
          userID: userID,
        };
        console.log('register LanBlogUser data:', LanBlogUser)
        // 1. 注册本地账号
        await register(LanBlogUser);
        // 2. 注册OAuth账号
        // const OauthName = oauth+ '_' + `${Math.random()}`;
        const OauthUser = {
          username: name,
          realname: name,
          userID: userID,
          oauthID: oauthID,
          oauth: oauth,
        };
        console.log('register OauthUser data:', OauthUser)
        await GoogleOauthRegister(OauthUser);
        // 3. 绑定OAuth账号到本地账号
        await bindGoogle(userID, oauthID, oauth);
      } else {
        console.log("check user information for this userID: ",userID);
        userID = isGoogleUserExists.userID;
      }
      // 4. 查询用户信息颁发令牌
      //case1 不存在，但前面已经创建了用户，可以签发令牌
      //case2 存在，直接签发令牌
      console.log("check user information for this userID: ",userID);
      const userInfo = await isUserExists({
        username: '',
        realname: '',
        userID: userID
      });
      // 5. 颁发令牌
      console.log('userInformation:', userInfo);
      const payLoad = {
        username: userInfo.username,
        realname: userInfo.realname,
        userID: userInfo.userID,
        oauthID: userInfo.oauthID,
        oauth: oauth
      };
      console.log('oauth user create jwt: ', payLoad);
      const token = jwt.sign(payLoad, secretOrPrivateKey, options);
      req.session.access_token = token;
      console.log('req.session.access_token = ', token);
      const xsrfTokenId = genXSRFId();
      const xsrfPayload = {
        id: xsrfTokenId
      };
      let xsrf_token = jwt.sign(xsrfPayload, secretOrPrivateKeyForCSRF, options);
      console.log("oauth user create xsrf token:", xsrf_token);
      res.cookie('XSRF-TOKEN',xsrf_token, { expires: new Date(Date.now() + 30 * 60 * 1000), sameSite: 'lax', path: '/'}); 
      access_token = undefined;
      return res.json(new SuccessModel({token: token, userInformation: payLoad, oauthID: oauthID, oauth: oauth}));
    } catch(error) {
      console.log("login By Google user failed error: ", error);
      access_token = undefined;
      return res.json(new ErrorModel('Google用户授权失败'));
    }
  }

  const bindingByGoogle = async function(req, res, id = '') {
    var oauthID = '';
    var oauth = 'Google';
    var userID = id;
    // binding Google to Blog user
    console.log("binding Google to Blog user");
    try {
      const result =await axios({
        url:`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`,
        method:'GET',
        headers:{Authorization: `Bearer ${access_token}`}
      })
      console.log("www.googleapis.com/oauth2/v1/userinfo result: ", result.data);
      oauthID = result.data.id;
      console.log('return oauthID: ', oauthID);
      const isGoogleUserExists = await isGoogleOauthUserExists(oauthID);
      if (isGoogleUserExists) {
        // return new Promise( (resolve, reject) => {
        //   reject(new ErrorModel({message: 'Binding failed cause for that this Google user have been bound'}));
        // }) 
        return res.json(new ErrorModel('该Google用户已绑定有LanBlog账号'));
      } else {
        // return res.json( new SuccessModel({GoogleID: oauthID}));
        // todo: bind Google
        // 1.查询用户的信息（用来注册Oauth表的username realname，重新颁发令牌）
        const userInfo = await isUserExists({
          username: '',
          realname: '',
          userID: userID
        });
        if (!userInfo) { throw Error("user is not exists")};
  
        // 2. 注册OAuth 账号
        // const OauthName = oauth+ '_' + `${Math.random()}`;
        const OauthUser = {
          username: userInfo.username,
          realname: userInfo.realname,
          userID: userID,
          oauthID: oauthID,
          oauth: oauth,
        };
        console.log('GoogleOauthRegister data:', OauthUser)
        await GoogleOauthRegister(OauthUser);
        // 3. 绑定OAuth账号
        await bindGoogle(req.params.userID, oauthID, oauth)
        // 颁发令牌
        const payLoad = {
          username: userInfo.username,
          realname: userInfo.realname,
          userID: userInfo.userID,
          oauthID: userInfo.oauthID,
          oauth: oauth
        }
        const token = jwt.sign(payLoad, secretOrPrivateKey, options);
        req.session.access_token = token;
        console.log(' req.session.access_token = ', token);
        const xsrfTokenId = genXSRFId();
        const xsrfPayload = {
          id: xsrfTokenId
        };
        let xsrf_token = jwt.sign(xsrfPayload, secretOrPrivateKeyForCSRF, options);
        console.log("oauth user create xsrf token:", xsrf_token);
        res.cookie('XSRF-TOKEN',xsrf_token, { expires: new Date(Date.now() + 30 * 60 * 1000), sameSite: 'lax', path: '/'}); 
        access_token = undefined;
        return res.json(new SuccessModel({token: token, userInformation: payLoad, oauthID: oauthID}));
      }
    } catch(error) {
      console.log("binding Google user failed");
      access_token = undefined;
      return res.json(new ErrorModel('Google用户授权失败'));
    }
  }

  router.get('/loginByGoogle', async function(req, res, next){
    console.log('route: loginByGoogle');
    if(access_token){
      loginByGoogle(req, res);
    } else{
      res.status(401).send();
    }
  })

  router.get('/bindByGoogle/:userID', async function(req, res, next){
    console.log('req.params:', req.params.userID);
    if(access_token){
      return bindingByGoogle(req, res, req.params.userID);
    } else{
      res.status(401).send();
    }
  })
  

  module.exports = router;
  