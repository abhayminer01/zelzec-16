const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    location : {
        lat : String,
        lng : String
    },
    full_name : String,
    mobile : Number,
    address : String,
    products : {
        type : Number,
        default : 0
    }
}, { timestamps : true });

const User = mongoose.model('User', userSchema);
module.exports = User;