const FollowSchema = require("../Schema/FollowSchema");
const UserSchema = require("../Schema/UserSchema");

const followUser = ({ followerUserId, followingUserId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const followExists = await FollowSchema.findOne({
        followerUserId,
        followingUserId,
      });
      if (followExists)
        return reject({ status: 400, message: "Already following" });
      const followObj = new FollowSchema({
        followingUserId,
        followerUserId,
        creationDateTime: Date.now(),
      });
      await followObj.save();
      resolve();
    } catch (error) {
      reject({ status: 500, message: "database error", error });
    }
  });
};

const followersList = ({ followingUserId, SKIP, LIMIT }) => {
  console.log(followingUserId);
  return new Promise(async (resolve, reject) => {
    try {
      const followersIds = await (
        await FollowSchema.find({ followingUserId })
      ).map((el) => el.followerUserId);
      const followerUserObjects = await UserSchema.aggregate([
        {
          $match: { _id: { $in: followersIds } },
        },
        {
          $facet : {
            data : [{$skip : SKIP}, {$limit : LIMIT}]
          }
        }
      ]);
      resolve(followerUserObjects[0].data);
    } catch (error) {
      reject(error);
    }
  });
};

const followingList = ({ followerUserId, SKIP, LIMIT }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const followings = await FollowSchema.aggregate([
        {
          $match: { followerUserId },
        },
        {
          $sort: { creationDateTime: -1 },
        },
        {
          $facet: {
            data: [{ $skip: SKIP }, { $limit: LIMIT }],
          },
        },
      ]);
      const followingUserIds = followings[0].data.map(
        (followObj) => followObj.followingUserId
      );
      const followingUserDetails = await UserSchema.aggregate([
        {
          $match: { _id: { $in: followingUserIds } },
        },
      ]);
      resolve(followingUserDetails);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { followUser, followingList, followersList };
