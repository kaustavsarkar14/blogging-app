const express = require("express")
const AuthRouter = express.Router()

AuthRouter.post('/register', (req, res)=>{
    return res.send("register hit")
})

module.exports = AuthRouter