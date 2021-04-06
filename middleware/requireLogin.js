
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require("../keys")
const mongoose= require("mongoose")
const User= mongoose.model("user")
module.exports = (req, res,next)=>{
    const {authorization} = req.headers
    if(!authorization)
    {
      return  res.status(401).json({error:"you  must be logged in "})
    }
    const token = authorization.replace("Bearer ", "")
   
    jwt.verify(token, JWT_SECRET, (err, payload)=>{
        if(err)
        {
           return res.status(401).json({error:"you must be logged in "})
        }
        const {id} = payload
        User.findById(id).then(userdata=>{
            req.user = userdata
            console.log(payload)
            next()    // this is here because above code may take a while!!!
        })
      
    }
    )
}