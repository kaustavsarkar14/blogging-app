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
const getAllBlogs = ({ SKIP, LIMIT }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blogs = await BlogSchema.aggregate([
        {
          $sort: { creationDateAndTime: -1 },
        },
        {
          $facet: {
            data: [{ $skip: SKIP }, { $limit: LIMIT }],
          },
        },
      ]);
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
          $match: { userId },
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
      resolve(blogs);
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
      const blogDb = await BlogSchema.findOneAndDelete({ _id: blogId });
      resolve(blogDb);
    } catch (error) {
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
