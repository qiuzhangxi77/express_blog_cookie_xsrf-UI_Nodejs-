const mysql = require('mysql')
const { MYSQL_CONFIG } = require('../config/db')

//创建连接对象
const con =mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'VySe-1929',
    port: '3306',
    database: 'myblog'
})

//开始连接
con.connect()

//统一执行 mysql 的函数
function exec(sql) {
    const promise = new Promise( (resolve, reject) => {
        con.query(sql, (err,result) => {
            if(err) {
                reject(err)
                return
            }
            resolve(result)
        })

    })
    return promise
}

module.exports = {
    exec,
    escape: mysql.escape
}