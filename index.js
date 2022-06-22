const express=require('express')

// import jsonwebtoken
const jwt=require('jsonwebtoken')

// import dataservice
const dataService=require('./services/data.service')

// server app create using express
const app=express()

// parse json data
app.use(express.json())

// application specific middleware
const appMiddleware=(req,res,next)=>{
    console.log("Application specific middleware");
    next()
}

app.use(appMiddleware)

// router specific middleware
const jwtMiddleware=(req,res,next)=>{
    try {
        token=req.headers['x-access-token']
        // varify token
        const data=jwt.verify(token,'supersecretkey12345')
        console.log(data);
        next()
    }
     catch {
        res.status(401).json({
            status:false,
            statusCode:401,
            message:"Please Log In"
        })
    }
}

//register api
app.post('/register',(req,res)=>{
    console.log(req.body);
    const result=dataService.register(req.body.username,req.body.acno,req.body.password)
    res.status(result.statusCode).json(result)
})

//login api
app.post('/login',(req,res)=>{
    console.log(req.body);
    const result=dataService.login(req.body.acno,req.body.pswd)
    res.status(result.statusCode).json(result)
})

app.post('/deposit',jwtMiddleware,(req,res)=>{
    console.log(req.body);
    const result=dataService.deposit(req.body.acno,req.body.pswd,req.body.amt)
    res.status(result.statusCode).json(result)
})

app.post('/withdraw',jwtMiddleware,(req,res)=>{
    console.log(req.body);
    const result=dataService.withdraw(req.body.acno,req.body.pswd,req.body.amt)
    res.status(result.statusCode).json(result)
})

app.post('/transaction',jwtMiddleware,(req,res)=>{
    console.log(req.body);
    const result=dataService.getTransaction(req.body.acno)
    res.status(result.statusCode).json(result)
})


app.get('/',(req,res)=>{
    res.send("Get Request")
})
app.post('/',(req,res)=>{
    res.send("Post Request")
})
app.put('/',(req,res)=>{
    res.send("Put Request")
})
app.patch('/',(req,res)=>{
    res.send("Patch Request")
})
app.delete('/',(req,res)=>{
    res.send("Delete Request")
})



app.listen(3000,()=>{
    console.log("server started at 3000");
})