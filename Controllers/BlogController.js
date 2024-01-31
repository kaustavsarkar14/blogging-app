const express = require("express");
const { blogDataValidate } = require("../Utils/BlogUtils");
const { createBlog, getAllBlogs, getMyBlogs } = require("../Models/BlogModel");
const User = require("../Models/UserModel");
const blogRouter = express.Router();

blogRouter.post("/create-blog", async (req, res) => {
  const { title, textBody } = req.body;
  const userId = req.session.user._id;
  const creationDateAndTime = new Date();

  try {
    await User.findUserWithId(userId);
    await blogDataValidate({ title, textBody });
  } catch (error) {
    return res.send({ status: 400, message: error });
  }
  try {
    const blogDb = await createBlog({
      title,
      textBody,
      userId,
      creationDateAndTime,
    });
    return res.send({ status: 201, message: "blog created", data: blogDb });
  } catch (error) {
    return res.send({ status: 500, message: "database error", error });
  }
});

blogRouter.get("/get-blogs", async (req, res) => {
  const SKIP = Number(req.query.skip) || 0;
  const LIMIT = Number(req.query.limit) || 5;

  try {
    const blogs = await getAllBlogs({ SKIP, LIMIT });
    return res.send({ status: 200, data: blogs });
  } catch (error) {
    console.log(error);
    return res.send({ status: 500, message: "database error", error });
  }
});

blogRouter.get("/get-my-blogs", async (req, res) => {
  const SKIP = Number(req.query.skip) || 0;
  const LIMIT = Number(req.query.limit) || 5;
  const userId = req.session.user._id;
  try {
    const blogs = await getMyBlogs({ SKIP, LIMIT,userId });
    return res.send({ status: 200, data: blogs });
  } catch (error) {
    console.log(error);
    return res.send({ status: 500, message: "database error", error });
  }
});

module.exports = blogRouter;
