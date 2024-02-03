const express = require("express");
const User = require("../Models/UserModel");
const {
  followUser,
  followingList,
  followersList,
} = require("../Models/FollowModel");
const FollowRouter = express.Router();

FollowRouter.post("/follow-user", async (req, res) => {
  const userId = req.session.user._id;
  const followingUserId = req.body.followingUserId;
  try {
    await User.findUserWithId(userId);
  } catch (error) {
    return res.send({ status: 400, message: "Follower user id is not valid" });
  }
  try {
    await User.findUserWithId(followingUserId);
  } catch (error) {
    return res.send({ status: 400, message: "Following user id is not valid" });
  }
  try {
    await followUser({ followerUserId: userId, followingUserId });
    return res.send({ status: 201, message: "follow successful" });
  } catch (error) {
    return res.send(error);
  }
});
FollowRouter.get("/followers-list", async (req, res) => {
  const followingUserId = req.session.user._id;
  const SKIP = Number(req.query.skip) || 0;
  const LIMIT = Number(req.query.skip) || 10;
  try {
    const followers = await followersList({ followingUserId, SKIP, LIMIT });
    res.send({status:200, data: followers})
  } catch (error) {
    console.log(error);
    return res.send({ staus: 500, message: "database error" });
  }
});
FollowRouter.get("/following-list", async (req, res) => {
  const followerUserId = req.session.user._id;
  const SKIP = Number(req.query.skip) || 0;
  const LIMIT = Number(req.query.limit) || 10;
  try {
    const followings = await followingList({ followerUserId, SKIP, LIMIT });
    return res.send({ status: 200, data: followings });
  } catch (error) {
    console.log(error);
    return res.send({ staus: 500, message: "database error" });
  }
});
module.exports = FollowRouter;
