const express = require('express')
const AuthRouter = require('./Controllers/AuthController.js')
const app = express()
require('dotenv').config()

// file imports 
require('./db.js')

app.use(express.json())
app.use('/auth', AuthRouter)

app.listen(process.env.PORT, ()=>{
    console.log("server is running")
})