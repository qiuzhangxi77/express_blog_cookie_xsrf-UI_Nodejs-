var express = require('express');
var router = express.Router();
const {login, register, isUserExists} = require('../controller/user')
const { genXSRFId } = require('../utils/cryp');
const { SuccessModel, ErrorModel } = require('../model/resModel')
var jwt = require('jsonwebtoken')

const options = {
    algorithm: 'HS256',
    expiresIn: '1h'
}
const secretOrPrivateKey = 'issac77'
const secretOrPrivateKeyForCSRF = 'csrf77'
const loginOrigin = 'LanBlog'



router.post('/login', function(req, res, next) {
    const{ username, password} = req.body
    console.log( 'req.body:',req.body)
    const result = login(username, password)
    return result.then( data => {
        console.log('login data: ',data)
        if(data.username){
            //颁发jwt token
            let payLoad = {
                username: data.username,
                realname: data.realname,
                userID: data.userID,
                origin: loginOrigin
            }
            if(data.GitHubID) {
                payLoad = {
                    username: data.username,
                    realname: data.realname,
                    userID: data.userID,
                    GitHubID: data.GitHubID,
                    origin: loginOrigin
                }
            }
            const token = jwt.sign(payLoad, secretOrPrivateKey, options);
            req.session.access_token = token;
            console.log(' req.session.access_token = ', token);
            //let xsrf_token = genXSRFId();
            const xsrfTokenId = genXSRFId();
            const xsrfPayload = {
                id: xsrfTokenId
            };
            let xsrf_token = jwt.sign(xsrfPayload, secretOrPrivateKeyForCSRF, options);
            res.cookie('XSRF-TOKEN',xsrf_token, { expires: new Date(Date.now() + 30 * 60 * 1000), sameSite: 'lax', path: '/'}); 
            //注意 不能设置为http only 否则http拦截器无法读取
            // res.cookie('XSRF-TOKEN',xsrf_token, { expires: new Date(Date.now() + 30 * 60 * 1000), httpOnly: true}); 
            console.log(' XSRF-TOKEN = ', xsrf_token);
            res.json(new SuccessModel({token: token, userInformation: payLoad}))
         } else {
            res.json(new ErrorModel('登录失败'))
         }
     })
});

router.get('/logout',function(req, res, next){
    req.session=null;
    res.clearCookie('in-sess');
    res.clearCookie('XSRF-TOKEN');
    res.status(200).send();
})


router.post('/testScriptXMLPost', async function(req, res, next) {
    console.log("req.body:", req.body)
    console.log("testScriptXMLPost.body")
    return new Promise( (resolve, reject) => {
        res.json(new ErrorModel('testScriptXMLPost'))
    })
});

router.get('/userInfo', function(req, res, next) {
    if(req.session?.access_token) {
        let payLoad;
        try{
            payLoad = jwt.verify(req.session.access_token, secretOrPrivateKey);
            console.log('pass token verify, and get the user data' , payLoad)
            return res.json(new SuccessModel(payLoad))
        } catch (e) {
            console.log('not pass token verify, and not get the user data');
            return res.json(new ErrorModel('尚未登录'))
        }
    } else {
        console.log('not pass access_token verify, and not get the user data');
        return res.json(new ErrorModel('尚未登录'))
    }
});

router.post('/register', async function(req, res, next) {
    const{ realname, username, password,} = req.body;
    const user = {
        username: username,
        realname: realname
    }
    console.log( 'req.body:',req.body);
    const queryResult = isUserExists(user);
    await queryResult.then( data => {
        if(data) {
            console.log('register isUserExists:', data)
            return new Promise( (resolve, reject) => {
            res.json(new ErrorModel('用户名已存在，注册失败'))
        })
        }
    });
    const LanBlogUser = {
        username: username,
        password: password,
        realname: realname
    };
    const result = register(LanBlogUser);
    return result.then( data => {
        console.log('/register:',data)
        if(data){
            res.json(new SuccessModel('注册成功'))
         } else {
            res.json(new ErrorModel('注册失败'))
         }
     })
});




module.exports = router;