const crypto = require('crypto')
const { RANDOM } = require('mysql/lib/PoolSelector')

//密匙
const SECRET_KEY = 'Dxx_7662'

// md5 加密
function md5(content) {
    let md5 = crypto.createHash('md5')
    return md5.update(content).digest('hex')
}

//加密函数
function genPassword(password) {
    const str = `password=${password}&key=${SECRET_KEY}`
    return md5(str)
}

//生成用户唯一的userID
function genUserID() {
    let userID = `user${Date.now()}${Math.random()}`
    return userID
}

//生成用户唯一的blogID
function genBlogID() {
    let createtime = Date.now()
    let blogID = 'blog' + createtime + `${Math.random()}`
    return { createtime, blogID}
}


//生成用户唯一的xsrfToken
function genXSRFId() {
    let id = `abc${Date.now()}${Math.random()}`
    return id
}


module.exports = {
    genPassword,
    genUserID,
    genBlogID,
    genXSRFId
}