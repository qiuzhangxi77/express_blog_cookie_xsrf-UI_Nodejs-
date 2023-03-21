const { exec } = require('../db/mysql')
const { filterXSS } = require('xss')
const { genBlogID} = require('../utils/cryp')

const getList = (userID) =>{
    //1=1是防止author和keyword为空
    let sql = `select * from blogs where 1=1 `
    // if (author) {
    //     sql += `and user='${user}'`
    // }
    // if (keyword) {
    //     sql += `and title like '%${keyword}%'`
    // }
    if (userID) {
        sql += `and userID='${userID}'`
    }
    sql += `order by createtime desc;`

    console.log("getListSql:",sql)
    //返回promise
    return exec(sql)
}


const newBlog = (blogData = {}) =>{
    //输入过滤
    // 在用户提交时，由前端过滤输入，然后提交到后端。这样做是否可行呢？答案是不可行。一旦攻击者绕过前端过滤，直接构造请求，就可以提交恶意代码了。
    //那么，换一个过滤时机：后端在写入数据库前，对输入进行过滤，然后把 “安全的” 内容，返回给前端。 这样是否可行呢？
    //预防xss攻击 后端使用xss库 原理转义字符 如<>转义&l &r
 
    //注意 前端有可能需要反转义 即前端有可能显示&l title &r
    //浏览器在输出这些转义后的字符时，会自行进行一次 decode(反转义)，比如往浏览器输入&lt;将会被 decode 成<,而被 decode 后的字符，就只是单纯的字符串，而不会被浏览器解析。
    //(1)在前端中，不同的位置所需的编码也不同。当 5 &lt; 7 作为 HTML 拼接页面时，可以正常显示：
    //<div title="comment">5 &lt; 7</div>
    //一般前端显示后端传来数据的时候使用的是AJAX方法
    //(2)当 5 &lt; 7 通过 Ajax 返回，然后赋值给 JavaScript 的变量时，前端得到的字符串就是转义后的字符。
    //这个内容不能直接用于 Vue 等模板的展示，也不能直接用于内容长度计算。不能用于标题、alert 等。
    // const title = blogData.title
    const title = filterXSS(blogData.title)
    const content = filterXSS(blogData.content)
    const author = blogData.author
    const user = blogData.user
    const userID = blogData.userID
    const { createtime, blogID} = genBlogID()

    let sql = `
        insert into blogs (title, content, createtime, author, user, userID, blogID) values ('${title}', '${content}', ${createtime}, '${author}', '${user}', '${userID}', '${blogID}')
    `
    console.log('newBlog sql: ', sql)
    return exec(sql).then( insertData => {
        console.log('insertData is ', insertData)
        return {
            id: insertData.insertId
        }
    })
}

const updateBlog = ( (blogData={})=>{
    const title = filterXSS(blogData.title)
    const content = filterXSS(blogData.content)
    const blogID = blogData.blogID
    const userID = blogData.userID

    let sql = `
        update blogs set title='${title}', content='${content}' where userID='${userID}' and blogID='${blogID}'
    `

    return exec(sql).then( updateData => {
        console.log('updataData is ', updateData)
        if(updateData.affectedRows > 0) {
            return true
        }
        return false
    })
})


const deleteBlog = ( (userID, blogID) =>{
    let sql = `
        delete from blogs where userID='${userID}' and blogID='${blogID}'
    `

    return exec(sql).then( deleteData => {
        if(deleteData.affectedRows > 0) {
            return true
        }
        return false
    }) 
})

module.exports = {
    getList,
    newBlog,
    updateBlog,
    deleteBlog,
    updateBlog
}