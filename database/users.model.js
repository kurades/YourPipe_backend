const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    email : {type:String, require : true, unique : true},
    username : {type : String, require : true, unique : true},
    password : {type : String, require : true, unique : false},
    // playlist : [{type : mongoose.Types.ObjectId, ref : 'Music'}],
    playlist : [String],
},{timestamps:true})
const User = mongoose.model('User',UserSchema)
module.exports = User;