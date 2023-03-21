const { exec, escape } = require('../db/mysql')



const bindGoogle =  (userID, oauthID, oauth)=>{
    let sql = `
    update users set oauthID='${oauthID}', oauth='${oauth}' where userID='${userID}'
`
    console.log(sql)
    return exec(sql).then( insertData => {
        console.log('bindGoogle to userID: ', userID)
        return {
            id: insertData.insertId
        }
    })
}


const isGoogleOauthUserExists = (oauthID) =>{
    //1=1是防止author和keyword为空
    let sql = `select * from googleusers where 1=1 `
    if (oauthID) {
        sql += `and oauthID='${oauthID}' `
    }
    sql += `;`
    console.log("isGoogleOauthUserExists:",sql)
    //返回promise
    return exec(sql).then( data => {
        console.log("isGoogleOauthUserExists data:",data)
        return data? data[0] : null;
    })
}


const GoogleOauthRegister =  (OauthUser)=>{
    // 防止前端sql注入攻击
    username = escape(OauthUser?.username)
    realname = escape(OauthUser?.realname)
    userID = escape(OauthUser?.userID)
    oauthID = escape(OauthUser?.oauthID)
    oauth = escape(OauthUser?.oauth)
    
    //escape自带‘’
    const sql = `
        insert into googleusers (username, realname, userID, oauthID) values (${username}, ${realname}, ${userID}, ${oauthID})
    `
    console.log(sql)
    return exec(sql).then( insertData => {
        console.log('googleOauthRegister insertData is ', insertData)
        return {
            id: insertData.insertId
        }
    })
}

module.exports = {
    bindGoogle,
    isGoogleOauthUserExists,
    GoogleOauthRegister,
}