const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title : {
        type: String,
        required : true,
        minLength: 3,
        maxLength: 50
    },
    textBody : {
        type: String,
        required : true,
        maxLength: 200
    },
    creationDateAndTime : {
        type : Date,
        required : true
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,        
        required : true,
        ref: 'user'
    }
})

module.exports = mongoose.model("blog", blogSchema)