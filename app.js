const express = require('express')
const app = express()

const mongoose = require('mongoose')
const port = 5000
const {mongoURI} = require('./keys')


mongoose.connect(mongoURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
mongoose.connection.on('connected',()=>{
    console.log("connected to mongo db")
})
mongoose.connection.on('error',(err)=>{
    console.log("connecting  ", err)
})

require('./models/users')
require('./models/post')
// mongoose.model("user")
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))





app.listen(port,()=>{
    console.log("server is running on ", port)
})
// password =bXwoen2KMNhR6h1a
// mongodb+srv://chitrang:<password>@cluster0.ibthb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority