// db connection
// import mongoose
const mongoose = require('mongoose')

// connection string
mongoose.connect('mongodb://localhost:27017/bankServer',{
    useNewUrlParser:true
})

// model definition
// use singular of collection name as model and first letter must be capital
const User = mongoose.model('User',{
    acno:Number,
    username:String,
    password:String,
    balance:Number,
    transaction: []
})

// 
module.exports={
    User
}