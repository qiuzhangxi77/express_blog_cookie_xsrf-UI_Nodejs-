const env = process.env.NODE_ENV


//配置

let MYSQL_CONFIG = {}
let REDIS_CONFIG = {}

if(env === 'dev') {
    MYSQL_CONFIG = {
        host: 'localhost',
        user: 'root',
        password: 'VySe-1929',
        port: '3306',
        database: 'myblog'
    }

    REDIS_CONFIG = {
        port: 6379,
        host: '127.0.0.1'
    }
}

if(env === 'production') {
    MYSQL_CONFIG = {
        host: 'localhost',
        user: 'root',
        password: 'VySe-1929',
        port: '3306',
        database: 'myblog'
    }

    REDIS_CONFIG = {
        port: 6379,
        host: '127.0.0.1'
    }
}

module.EXPORTS = {
    MYSQL_CONFIG,
    REDIS_CONFIG
}