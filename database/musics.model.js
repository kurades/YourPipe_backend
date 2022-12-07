const mongoose = require('mongoose')

const MusicSchema = new mongoose.Schema({
    url : String,
    audioUrl : String,
    title : String,
    videoId : String,
    description : String,
    thumbnail : String,
    seconds : Number,
    timeStamp : String,
    ago : String,
    views : Number,
    author : {
        name : String,
        url : String,
    },
    updateAt : {type : Date, default : Date.now()},
})

const Music = mongoose.model('Music',MusicSchema)

module.exports = Music