const mongoose = require('mongoose')
const {MONGOURL} = require('../constant')

function DBConnect () {
    mongoose.connect(MONGOURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },()=>console.log("  ---DATABASE RUNNING---  "))

    const db = mongoose.connection
    db.on("error", console.error.bind(console, "connection error:"))
}

module.exports = DBConnect;

