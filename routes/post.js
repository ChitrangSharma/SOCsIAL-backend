const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require("../middleware/requireLogin")
const Post = mongoose.model("Post")

router.get("/allposts",requireLogin,(req,res)=>{
Post.find()
.populate("postedBy","_id name email")
.populate("comments.postedBy","_id name")
.then(posts=>{
    res.json({posts})
})
.catch(err =>{console.log(err)})
})


router.post('/createpost',requireLogin,(req,res)=>{
    const {title, body, pic}= req.body 
    if(!title || !body || !pic){
    return res.status(422).json({error:"please add all the fields"})
    }
    console.log(req.user)
    // res.send("ok")
    req.user.password =undefined
    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    }
        ).catch(err=>{
            console.log(err)
        })

})


// this route is not working  : error may be in id|_id|iat these i have checked all are undefined

// solved  i have forget to make it a protectetd route without making it a protectetd route we cannot access the => (req.user) thing
router.get("/mypost",requireLogin,(req,res)=>{
    console.log(req.user);
    Post.find({postedBy: req.user._id})
    .populate("PostedBy","_id name")
    .then(mypost =>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log("error at the place", err)
    })
})

router.put("/like",requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.put("/unlike",requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.put("/comment",requireLogin,(req,res)=>{
    const comment ={
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.delete("/deletecomment/:id/:comment_id", requireLogin,(req,res)=>{
    const comment ={_id:req.params.comment_id};
    Post.findByIdAndUpdate(
        req.params.id,{
            $pull:{comments:comment},
        },
        {
            new:true,
        }
    )
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err, postComment)=>{
        if(err || !postComment){
            return
            res.status(422).json({error:err});
        }
        else{
            const result=postComment;
            res.json(result)
        }
  });
})


router.delete("/deletepost/:postId/",requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err, post)=>{
    if(err || !post){
        return res.status(422).json({error:err})

    }   
    if(post.postedBy._id.toString() === req.user._id.toString())
    {
        post.remove()
        .then(result =>{
            res.json(result)

        }).catch(err=>{console.log(err)})
    } 
    })
})

// get the posts of the following users...
router.get("/getsubpost",requireLogin,(req,res)=>{
    // console.log(req.user);
    // if postedBy in following --> something like this in python
    Post.find({postedBy:{$in:req.user.following}})
    .populate("PostedBy","_id name email")
    .then(posts =>{
        res.json({posts})
    })
    .catch(err=>{
        console.log("error at the place", err)
    })
})


// smile 
router.put("/smile",requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{smile:req.user._id}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})



// unsmile
router.put("/unsmile",requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{smile:req.user._id}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})
module.exports = router