
const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const User = mongoose.model("user")
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const{JWT_SECRET} = require("../keys")

const requireLogin=  require("../middleware/requireLogin")
const { json } = require('express')

router.get("/protected",requireLogin,(req,res)=>{
    res.send("hello user")
})

router.post("/signup",(req,res)=>{
   const {name, email, password,pic} = req.body 
   if(!email || !password || !name){
       return res.status(422).json({error:"please add all the fields"})
   }
   User.findOne({email:email})
   .then((savedUser)=>{
       if(savedUser){
           return res.status(422).json({error:"user already exists"})
       }
       bcrypt.hash(password,12)
       .then(hashedpassword =>{
        const user = new User({
            email,
            password:hashedpassword,
            name,
            pic
        })
        user.save()
        .then(user =>{
            res.json({message:"saved successfully"})
        })
        .catch(err =>{
            console.log("error occured",err)
        })
       })
      
   })
   .catch(err=>{
    console.log("error ", err)
})

})

router.post("/signin",(req,res)=>{
    const{email, password,} = req.body
    if(!email || !password){
        res.status(422).json({error:"please add email and password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
         return   res.status(422).json({error:"invalid emial or password"})
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({messag: "successfully signed in "})
                // send a token to the user first 
                // using JWT
                const token = jwt.sign({id :savedUser._id},JWT_SECRET)
                const {_id, name,email,followers, following,pic}=savedUser
                res.json({token,user:{_id, name,email,followers,following,pic}})
            }
            else{
                return res.status(422).json({error:"invalid email or password"})
            }
        }).catch(err=>{
            console.log(err)
        })

    })

})

module.exports = router