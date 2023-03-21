const fs = require('fs')
const path = require('path')

function createWriteStream (fileName) {
    const fullFileName = path.join(__dirname,'../','logs',fileName)
    const writeStream = fs.createWriteStream(fullFileName,{
        flags: 'a'
    })
    return writeStream
}

const accessWriteStream = createWriteStream('access.log')
const errorWriteStream = createWriteStream('error.log')
const eventWriteStream = createWriteStream('event.log')


module.exports = {
    accessWriteStream,
    errorWriteStream,
    eventWriteStream
}