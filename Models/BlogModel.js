const BlogSchema = require("../Schema/BlogSchema");

const createBlog = ({ title, textBody, userId, creationDateAndTime }) => {
  return new Promise(async (resolve, reject) => {
    const blogObj = new BlogSchema({
      title,
      textBody,
      userId,
      creationDateAndTime,
    });
    try {
      const blogDb = await blogObj.save();
      resolve(blogDb);
    } catch (error) {
      reject(error);
    }
  });
};
const getAllBlogs = ({ followingUserIds, SKIP, LIMIT }) => {
  return new Promise(async (resolve, reject) => {
    try {
      let blogs = [];
      const followingUsersBlogs = await BlogSchema.aggregate([
        {
          $match: {
            userId: { $in: followingUserIds },
            isDeleted: { $ne: true },
          },
        },
        {
          $sort: { creationDateAndTime: -1 },
        },
        {
          $facet: {
            data: [{ $skip: SKIP }, { $limit: LIMIT }],
          },
        },
      ]);
      if (followingUsersBlogs[0].data.length == LIMIT)
        return resolve(followingUsersBlogs[0].data);
      const nonFollowingUsersBlogs = await BlogSchema.aggregate([
        {
          $match: {
            userId: { $nin: followingUserIds },
            isDeleted: { $ne: true },
          },
        },
        {
          $sort: { creationDateAndTime: -1 },
        },
        {
          $facet: {
            data: [
              { $skip: SKIP },
              { $limit: LIMIT - followingUsersBlogs[0].data.length },
            ],
          },
        },
      ]);
      blogs = [
        ...followingUsersBlogs[0].data,
        ...nonFollowingUsersBlogs[0].data,
      ];
      resolve(blogs);
    } catch (error) {
      reject(error);
    }
  });
};
const getMyBlogs = ({ SKIP, LIMIT, userId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blogs = await BlogSchema.aggregate([
        {
          $match: { userId,isDeleted:{$ne:true}  },
        },
        {
          $sort: { creationDateAndTime: -1 },
        },
        {
          $facet: {
            data: [{ $skip: SKIP }, { $limit: LIMIT }],
          },
        },
      ]);
      resolve(blogs[0].data);
    } catch (error) {
      reject(error);
    }
  });
};
const getBlogWithId = (blogId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blogDb = await BlogSchema.findOne({
        _id: blogId,
      });
      if (!blogDb) reject("No blog found with this blog id");
      resolve(blogDb);
    } catch (error) {
      reject(error);
    }
  });
};
const editBlog = ({ newData, blogId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blogDb = await BlogSchema.findOneAndUpdate(
        { _id: blogId },
        newData
      );
      resolve(blogDb);
    } catch (error) {
      reject(error);
    }
  });
};
const deleteBlog = (blogId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blogDb = await BlogSchema.findOneAndUpdate(
        { _id: blogId },
        { isDeleted: true }
      );
      resolve(blogDb);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
module.exports = {
  createBlog,
  getAllBlogs,
  getMyBlogs,
  editBlog,
  getBlogWithId,
  deleteBlog,
};
