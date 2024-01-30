const isAuth = (req, res, next)=>{
    if(req.session.isAuth) next()
    return res.send({status: 401, message: "session expired"})
}

module.exports = isAuth