const mongoose = require('mongoose')

const {ObjectId} = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/chit/image/upload/v1617282683/instagram-3814049_1280-removebg-preview_b2frnf.png"
    },
    followers:[{type:ObjectId,ref:"user"}],
    following:[{type:ObjectId,ref:"user"}]
  
    

})
mongoose.model("user", userSchema)