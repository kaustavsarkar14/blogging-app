const mongoose = require("mongoose");

const followSchema = new mongoose.Schema({
  followingUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  followerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  creationDateTime: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("follow", followSchema);
