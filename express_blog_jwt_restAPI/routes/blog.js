var express = require('express');
var router = express.Router();
const { getList, newBlog, updateBlog, deleteBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } =require('../model/resModel')

//获取博客列表
router.get('/list', function(req, res, next) {
    // const author = req.query.author || ''
    //const keyword = req.query.keyword || ''
   //  const listData = getList(author, keyword)
   //  return new SuccessModel(listData)
   const result = getList()
   console.log('result:', result)
   return result.then( listData => {
       res.json(new SuccessModel(listData))
   })
});

//获取用户的博客列表
router.get('/list/:userID', function(req, res, next) {
    const userID = req.params.userID
    // const author = req.query.author || ''
    console.log("get my blogList and userID = ",userID)
    //  const listData = getList(author, keyword)
    //  return new SuccessModel(listData)
    const result = getList(userID)
    return result.then( listData => {
        return res.json(new SuccessModel(listData))
    })
});


//新增一篇博客
router.post('/:userID/new', function(req, res, next) {
    //经过登录验证后取得用户名
    // req.body.user = app.get('username')
    // req.body.author = app.get('realname')
    // req.body.userID = app.get('userID')
    console.log('new blog:', req.body)
    const result = newBlog(req.body)
    return result.then( data => {
        res.json (new SuccessModel(data))
    })
});

 //更新一篇博客
 router.put('/:userID/:blogID', function(req, res, next) {
    // req.body.userID = req.params.userID
    // req.body.blogID = req.params.blogID
    console.log('update blog: ', req.body)
    const result = updateBlog(req.body)
         return result.then( flag => {
            if(flag) {
                res.json(new SuccessModel())
            } else{
                res.json (new ErrorModel('更新博客失败'))
            }
         })
});

 //删除一篇博客
 router.delete('/:userID/:blogID', function(req, res, next) {
    const userID = req.params.userID
    const blogID = req.params.blogID
    const result = deleteBlog(userID, blogID)
         return result.then( flag => {
            if(flag) {
                res.json(new SuccessModel())
            } else{
                res.json (new ErrorModel('删除博客标题失败'))
            }
         })
});



module.exports = router;