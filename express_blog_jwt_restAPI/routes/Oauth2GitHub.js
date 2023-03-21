var express = require('express');
var router = express.Router();
const axios = require('axios');
const {genUserID, genXSRFId} = require('../utils/cryp');
const { SuccessModel, ErrorModel } = require('../model/resModel')
const CLIENT_ID = '5dfd07abb7e13606fa90';
const REDIRECT_URI = 'http://localhost:4200/GitHubRedirect';
const CLIENT_SECRET = 'df966d1a546fe47e3e895090fa03b5c70c6912ff';
var access_token = '';
var jwt = require('jsonwebtoken');
const loginNameForRegister = 'LanBlog';
const passwordForRegister = 'LanBlog';
const {isUserExists, register} = require('../controller/user');
const {isGitHubOauthUserExists, GitHubOauthRegister, bindGitHub} = require('../controller/githubUser');

const options = {
    algorithm: 'HS256',
    expiresIn: '1h'
}
const secretOrPrivateKey = 'issac77'
const secretOrPrivateKeyForCSRF = 'csrf77'

router.get('/GitHubAuthPage',function(req, res, next){ 
  console.log('AuthPage');
  let state = genUserID();
  res.cookie('XSRF-TOKEN', state); 
  res.send({authUrl: 'https://github.com/login/oauth/authorize?client_id=' + CLIENT_ID + '&redirect_uri=' + REDIRECT_URI + 
  '&scope=read:user&allow_signup=' + true + '&state=' + state }); 
})


router.post('/GitHubGetAccessToken', function(req, res, next){
  let state = req.headers['x-xsrf-token'];
  console.log('getAccessToken state:', state)
  axios({
  url:'https://github.com/login/oauth/access_token?client_id='+CLIENT_ID+'&client_secret='+CLIENT_SECRET+'&code='+req.body.code+'&redirect_uri='+REDIRECT_URI+'&state='+state,
  method:'POST',
  headers:{'Accept': 'application/json'}
  })
  .then(function(resp){
    if(resp.data.access_token){
    // req.session.token = resp.data.access_token;
    access_token = resp.data.access_token;;
    }
    // res.send(resp.data);
    //不需要传出access_token 因为验证还是用jwt生成token，即授权的时候用access token取回来的user信息注册或绑定一个账号，然后用jwt生成token
    res.status(200).send();
  })
  .catch(function(err){
  res.send(err);
  })
})


// router.get('/getUserDetails/:userID', async function(req, res, next){
//   console.log('req.params:', req.params.userID);
//   if(access_token){
//     var originID = '';
//     var userID = '';
//     var LanBlogUser = {};
//     if(req.params.userID !== 'login') {
//       userID = req.params.userID;
//       // binding GitHub to Blog user
//       console.log("binding GitHub to Blog user");
//       await axios({
//         url:'https://api.github.com/user',
//         method:'GET',
//         headers:{'Authorization': "token" +"  " + access_token}
//       })
//       .then( resp => {
//         if(resp.data.id) {
//           originID = resp.data.id;
//           console.log('return GitHubID: ', originID);
//           return isGitHubOauthUserExists(originID);
//         }
//       })
//       .then(async (exist) => {
//         //判断该GitHub用户是否已经被绑定过了
//         console.log('whether this GitHub user have been bound or exist: ', exist);
//         if(exist) {
//           return new Promise( (resolve, reject) => {
//             reject(new ErrorModel({message: 'Binding failed cause for that this GitHub user have been bound'}));
//         })
//         } else {
//           // return res.json( new SuccessModel({GitHubID: originID}));
//           // todo: bind GitHub
//           // 1. 注册OAuth 账号
//           const OauthName = origin+ '_' + `${Math.random()}`;
//           const OauthUser = {
//             username: OauthName,
//             realname: OauthName,
//             userID: userID,
//             originID: originID,
//             origin: origin,
//           };
//           console.log('GitHubOauthRegister data:', OauthUser)
//           await GitHubOauthRegister(OauthUser);
//           // 2. 绑定OAuth账号
//           await bindGitHub(req.params.userID, originID)
//           // 3. 查询用户的信息（用来重新颁发令牌）
//           return isUserExists({
//             username: '',
//             realname: '',
//             userID: userID
//           });
//         }
//       })
//       .then( value => {
//         console.log('oauth user create jwt');
//         const payLoad = {
//           username: value.username,
//           realname: value.realname,
//           userID: value.userID,
//           GitHubID: value.GitHubID,
//           origin: origin
//         } 
//         const token = jwt.sign(payLoad, secretOrPrivateKey, options);
//         req.session.access_token = token;
//         console.log(' req.session.access_token = ', token);
//         const xsrfTokenId = genXSRFId();
//         const xsrfPayload = {
//             id: xsrfTokenId
//         };
//         let xsrf_token = jwt.sign(xsrfPayload, secretOrPrivateKeyForCSRF, options);
//         console.log("oauth user create xsrf token:", xsrf_token);
//         res.cookie('XSRF-TOKEN',xsrf_token, { expires: new Date(Date.now() + 30 * 60 * 1000), sameSite: 'lax', path: '/'}); 
//         return res.json(new SuccessModel({token: token, userInformation: payLoad, GitHubID: originID}));
//       })
//       .catch(function(err){
//         // res.send(err);
//         return res.json(new ErrorModel('GitHub用户授权失败'));
//       })    
//     }
//     else {
//       console.log("using GitHub login Blog");
//       await axios({
//         url:'https://api.github.com/user',
//         method:'GET',
//         headers:{'Authorization': "token" +"  " + access_token}
//       })
//       .then(resp => {
//         if(resp.data.id) {
//           //根据resp的数据查找是否已经绑定了用户还是首次登录需要注册
//           //step1 查询本地网站第三方用户是否已存在
//           originID = resp.data.id;
//           console.log('return GitHubID: ', originID);
//           return isGitHubOauthUserExists(originID);
//         }
//       })
//       .then(async (exist) => {
//         console.log('is GitHub bound or exist: ', exist);
//         if(!exist) {
//           //case1 不存在，则首先注册一个本地账号并绑定
//           const name = loginNameForRegister + '_' + `${Math.random()}`;
//           const password = passwordForRegister + '_' + `${Math.random()}`;
//           userID = genUserID();
//           LanBlogUser = {
//             username: name,
//             password: password,
//             realname: name,
//             userID: userID,
//           };
//           console.log('register LanBlogUser data:', LanBlogUser)
//           // 1. 注册本地账号
//           await register(LanBlogUser);
//           // 2. 注册OAuth账号
//           const OauthName = origin+ '_' + `${Math.random()}`;
//           const OauthUser = {
//             username: OauthName,
//             realname: OauthName,
//             userID: userID,
//             originID: originID,
//             origin: origin,
//          };
//           await GitHubOauthRegister(OauthUser);
//           // 3. 绑定OAuth账号到本地账号
//           await bindGitHub(userID, originID);
//         } else {
//           console.log("check user information for this userID: ",userID);
//           userID = exist.userID;
//         }
//         // 4. 查询用户信息颁发令牌
//         //case1 不存在，但前面已经创建了用户，可以签发令牌
//         //case2 存在，直接签发令牌
//         console.log("check user information for this userID: ",userID);
//         return isUserExists({
//           username: '',
//           realname: '',
//           userID: userID
//         });
//       })
//       .then(value => {
//         // 5. 颁发令牌
//         console.log('userInformation:', value);
//         console.log('oauth user create jwt');
//         const payLoad = {
//           username: value.username,
//           realname: value.realname,
//           userID: value.userID,
//           GitHubID: value.GitHubID,
//           origin: origin
//         } 
//         const token = jwt.sign(payLoad, secretOrPrivateKey, options);
//         req.session.access_token = token;
//         console.log(' req.session.access_token = ', token);
//         const xsrfTokenId = genXSRFId();
//         const xsrfPayload = {
//           id: xsrfTokenId
//         };
//         let xsrf_token = jwt.sign(xsrfPayload, secretOrPrivateKeyForCSRF, options);
//         console.log("oauth user create xsrf token:", xsrf_token);
//         res.cookie('XSRF-TOKEN',xsrf_token, { expires: new Date(Date.now() + 30 * 60 * 1000), sameSite: 'lax', path: '/'}); 
//         return res.json(new SuccessModel({token: token, userInformation: payLoad, GitHubID: originID}));
//       })
//       .catch(function(err){
//         // res.send(err);
//         return res.json(new ErrorModel('GitHub用户授权失败'));
//       })
//     }
//     access_token = undefined;
//   } else{
//     res.status(401).send();
//   }
// })

const bindingByGitHub = async function(req, res, id = '') {
  var oauthID = '';
  var oauth = 'GitHub';
  var userID = id;
  // binding GitHub to Blog user
  console.log("binding GitHub to Blog user");
  try {
    const result = await axios({
      url:'https://api.github.com/user',
      method:'GET',
      headers:{'Authorization': "token" +"  " + access_token}
    })
    oauthID = result.data.id;
    console.log('return oauthID: ', oauthID);
    const isGitHubUserExists = await isGitHubOauthUserExists(oauthID);
    if (isGitHubUserExists) {
      // return new Promise( (resolve, reject) => {
      //   reject(new ErrorModel({message: 'Binding failed cause for that this GitHub user have been bound'}));
      // }) 
      return res.json(new ErrorModel('该GitHub用户已绑定有LanBlog账号'));
    } else {
      // return res.json( new SuccessModel({GitHubID: oauthID}));
      // todo: bind GitHub
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
      console.log('GitHubOauthRegister data:', OauthUser)
      await GitHubOauthRegister(OauthUser);
      // 3. 绑定OAuth账号
      await bindGitHub(req.params.userID, oauthID, oauth)
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
    console.log("binding GitHub user failed");
    access_token = undefined;
    return res.json(new ErrorModel('GitHub用户授权失败'));
  }
}

const loginByGitHub = async function(req, res) {
  console.log("using GitHub login Blog");
  var oauthID = '';
  var oauth = 'GitHub';
  var LanBlogUser = {};
  var userID = '';
  try {
    const result =await axios({
      url:'https://api.github.com/user',
      method:'GET',
      headers:{'Authorization': "token" +"  " + access_token}
    })
    oauthID = result.data.id;
    console.log('return oauthID: ', oauthID);
    const isGitHubUserExists = await isGitHubOauthUserExists(oauthID);
    if (!isGitHubUserExists) {
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
      await GitHubOauthRegister(OauthUser);
      // 3. 绑定OAuth账号到本地账号
      await bindGitHub(userID, oauthID, oauth);
    } else {
      console.log("check user information for this userID: ",userID);
      userID = isGitHubUserExists.userID;
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
    console.log("login By GitHub user failed");
    access_token = undefined;
    return res.json(new ErrorModel('GitHub用户授权失败'));
  }
}

router.get('/loginByGitHub', async function(req, res, next){
  console.log('route: loginByGitHub');
  if(access_token){
    loginByGitHub(req, res);
  } else{
    res.status(401).send();
  }
})

router.get('/bindByGitHub/:userID', async function(req, res, next){
  console.log('req.params:', req.params.userID);
  if(access_token){
    return bindingByGitHub(req, res, req.params.userID);
  } else{
    res.status(401).send();
  }
})

module.exports = router;
