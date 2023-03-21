const { exec, escape } = require('../db/mysql')
const { genPassword, genUserID } = require('../utils/cryp')

const login = (username, password)=>{
    // const sql = `
    //     select username, realname from users where username='${username}' and password='${password}'
    // `
    // 防止前端sql注入攻击
    username = escape(username)
    //密码加密
    password = genPassword(password)
    console.log(password)

    password = escape(password)
    //escape自带‘’
    const sql = `
        select * from users where username=${username} and password=${password}
    `
    console.log(sql)
    return exec(sql).then( data => {
        console.log('select login data: ',data)
        return data[0] || {}
    })
}

const register =  (LanBlogUser)=>{
    // const sql = `
    //     select username, realname from users where username='${username}' and password='${password}'
    // `

    // 防止前端sql注入攻击
    username = escape(LanBlogUser.username)
    realname = escape(LanBlogUser.realname)
    //密码加密
    password = genPassword(LanBlogUser.password)
    password = escape(password)
    var userID = ''
    if(!LanBlogUser.userID) {
        userID = genUserID();
        userID = escape(userID);
    } else {
        userID = escape(LanBlogUser.userID)
    }

    //escape自带‘’
    const sql = `
        insert into users (username, password, realname, userID) values (${username}, ${password}, ${realname}, ${userID})
    `
    console.log(sql)
    return exec(sql).then( insertData => {
        console.log('insertData is ', insertData)
        return {
            id: insertData.insertId
        }
    })
}

const isUserExists = (user) =>{
    //1=1是防止author和keyword为空
    let sql = `select * from users where 1=1 `
    if (user.username) {
        sql += `and username='${user.username}' `
    }
    if (user.realname) {
        sql += `or realname='${user.realname}'`
    }
    if (!user.username &&user.userID) {
        sql += `and userID='${user.userID}'`
    }
    sql += `;`
    console.log("isUserExists:",sql)
    //返回promise
    return exec(sql).then( data => {
        console.log("isUserExists data:", data)
        return data? data[0] : null
    })
}


module.exports = {
    login,
    register,
    isUserExists,
}