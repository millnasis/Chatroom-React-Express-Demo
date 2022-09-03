module.exports = (async ()=>{
    const {dbURL} = require('../config/config')
    const {promisify} = require('util')
    const mongoCLient = require('mongodb').MongoClient
    
    const connect = promisify(mongoCLient.connect)

    const connection = await connect(dbURL)
    const db = connection.db('talkroom')
    return db
})()