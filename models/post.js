const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    }, 
    photo : {
        type:String,
        required:true
        // default:"no photo"
    },
    likes:[{type:ObjectId,ref:"user"}],
    // smile and unsmile...
    smile:[{type:ObjectId,ref:"user"}],
    unsmile:[{type:ObjectId,ref:"user"}],
    comments:[
        {
            text:String,
            postedBy:{type:ObjectId, ref:"user"}
        }
    ],

     postedBy:{
            type:ObjectId,
            ref:"user"
     }



});
module.exports=mongoose.model("Post", postSchema)
// mongoose.model("Post", postSchema)