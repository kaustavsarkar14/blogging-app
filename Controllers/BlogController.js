const express = require("express");
const { ObjectID } = require("mongoose");
const {
  blogDataValidate,
  editBlogDataValidate,
} = require("../Utils/BlogUtils");
const {
  createBlog,
  getAllBlogs,
  getMyBlogs,
  getBlogWithId,
  editBlog,
  deleteBlog,
} = require("../Models/BlogModel");
const User = require("../Models/UserModel");
const rateLimit = require("../Middlewares/RateLimiting");
const FollowSchema = require("../Schema/FollowSchema");
const BlogRouter = express.Router();

BlogRouter.post("/create-blog", rateLimit, async (req, res) => {
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
BlogRouter.get("/get-blogs", async (req, res) => {
  const SKIP = Number(req.query.skip) || 0;
  const LIMIT = Number(req.query.limit) || 5;
  const followerUserId = req.session.user._id;
  try {
    const followingUserIds = (await FollowSchema.find({ followerUserId })).map(
      (followObj) => followObj.followingUserId
    );
    const blogs = await getAllBlogs({ followingUserIds, SKIP, LIMIT });
    return res.send({ status: 200, data: blogs });
  } catch (error) {
    console.log(error);
    return res.send({ status: 500, message: "database error", error });
  }
});
BlogRouter.get("/get-my-blogs", async (req, res) => {
  const SKIP = Number(req.query.skip) || 0;
  const LIMIT = Number(req.query.limit) || 5;
  const userId = req.session.user._id;
  try {
    const blogs = await getMyBlogs({ SKIP, LIMIT, userId });
    return res.send({ status: 200, data: blogs });
  } catch (error) {
    console.log(error);
    return res.send({ status: 500, message: "database error", error });
  }
});
BlogRouter.post("/edit", rateLimit, async (req, res) => {
  const newData = req.body.data;
  const blogId = req.body.blogId;
  const userId = req.session.user._id;
  try {
    await User.findUserWithId(userId);
    await editBlogDataValidate(newData);
  } catch (error) {
    return res.send({ status: 400, message: error });
  }
  try {
    const blogDb = await getBlogWithId(blogId);
    if (userId.toString() !== blogDb.userId.toString())
      return res.send({ status: 401, message: "unauthorized request" });
    if (
      (Date.now() - new Date(blogDb.creationDateAndTime).getTime()) /
        1000 /
        60 >
      30
    )
      return res.send({
        status: 400,
        message: "Editing can only be done withing 30mins of posting",
      });
    const editedBlogDb = await editBlog({ newData, blogId });
    return res.send({
      status: 200,
      message: "blog edited",
      data: editedBlogDb,
    });
  } catch (error) {
    console.log(error);
    return res.send({ status: 500, message: "database error", error });
  }
});
BlogRouter.post("/delete", rateLimit, async (req, res) => {
  const blogId = req.body.blogId;
  const userId = req.session.user._id;
  try {
    await User.findUserWithId(userId);
    const blogDb = await getBlogWithId(blogId);
    if (!blogDb.userId.equals(userId))
      return res.send({ status: 401, message: "unauthorized request" });
  } catch (error) {
    return res.send({ status: 400, message: error });
  }
  try {
    const blogDb = await deleteBlog(blogId);
    return res.send({ status: 200, message: "Blog deleted" });
  } catch (error) {
    res.send({ status: 500, message: "database error", error });
  }
});
module.exports = BlogRouter;
