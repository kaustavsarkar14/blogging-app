const express = require("express");
const { validateRegisterData } = require("../Utils/AuthUtils");
const User = require("../Models/UserModel");
const AuthRouter = express.Router();
const bcrypt = require("bcrypt");

AuthRouter.post("/register", async (req, res) => {
  const { name, email, username, password } = req.body;
  try {
    await validateRegisterData({ name, email, username, password });
  } catch (error) {
    res.send({ status: 400, message: error });
  }
  try {
    await User.usernameAndEmailExists({ email, username });
  } catch (error) {
    return res.send({ status: 400, message: "invalid credentials", error });
  }
  try {
    const userObj = new User({ name, email, username, password });
    const userDb = await userObj.register();
    return res.send({
      status: 201,
      message: "registration successful",
      data: userDb,
    });
  } catch (error) {
    return res.send({ status: 500, message: "database error", error });
  }
});

AuthRouter.post("/login", async (req, res) => {
  const { loginId, password } = req.body;
  if(!loginId || !password) return res.send({status: 400, message:"missing credentials"})
  try {
    const userDb = await User.findUserWithLoginId({loginId})
    const isMatched = await bcrypt.compare(password, userDb.password)
    if(isMatched) return res.send({status:200, message:'login success'})
    return res.send({status:400, message:'wrong password'})
  } catch (error) {
    return res.send(error)
  }
});

module.exports = AuthRouter;
