const express = require("express");
const { validateRegisterData } = require("../Utils/AuthUtils");
const User = require("../Models/UserModel");
const AuthRouter = express.Router();

AuthRouter.post("/register", async (req, res) => {
  const { name, email, username, password } = req.body;
  try {
    await validateRegisterData({ name, email, username, password });
  } catch (error) {
    res.send({ status: 400, message: error });
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
    return res.send({status:500, message: "database error", error})
  }
});

module.exports = AuthRouter;
