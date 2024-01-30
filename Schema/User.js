const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name : {
        type : String, 
    },
    email : {
        type : String, 
        unique : true,
        required : true
    },
    username : {
        type : String, 
        unique : true,
        required : true
    },
    password : {
        type : String, 
        require : true
    }
})

module.exports = mongoose.model('user', userSchema)