const redis = require('redis')
const { REDIS_CONFIG } = require('../config/db')

//创建客户端
//Redis v4相对于v3有大变动 包括不自动连接 传统get set的用法需要设置legacyMode
const redisClient = redis.createClient({ legacyMode: true},6379, '127.0.0.1')

redisClient.on('ready', () => {
    console.log('Connected');
})

redisClient.on('error', err => {
    console.error(err)
})
redisClient.connect();


module.exports = redisClient