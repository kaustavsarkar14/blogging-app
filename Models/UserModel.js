const UserSchema = require("../Schema/UserSchema");
const bcrypt = require("bcrypt");

let User = class {
  constructor({ name, email, username, password }) {
    this.name = name;
    this.email = email;
    this.username = username;
    this.password = password;
  }
  register() {
    return new Promise(async (resolve, reject) => {
      const hashedPassword = await bcrypt.hash(
        this.password,
        Number(process.env.SALT)
      );
      const userObj = new UserSchema({
        name: this.name,
        email: this.email,
        username: this.username,
        password: hashedPassword,
      });
      try {
        const userDb = await userObj.save();
        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }
  static usernameAndEmailExists({ email, username }) {
    return new Promise(async (resolve, reject) => {
      try {
        const userExists = await UserSchema.findOne({
          $or: [{ email }, { username }],
        });
        if (userExists && userExists.email === email)
          reject("User with this email already exists");
        if (userExists && userExists.username === username)
          reject("User with this username already exists");
        resolve();
      } catch (error) {
        reject({ status: 500, message: "database error" });
      }
    });
  }
  static findUserWithLoginId({ loginId }) {
    return new Promise(async (resolve, reject) => {
      try {
        const userExists = await UserSchema.findOne({
          $or: [{ email: loginId }, { username: loginId }],
        });
        if (!userExists)
          reject({
            status: 400,
            message: "this email/username is not registered",
          });
        resolve(userExists);
      } catch (error) {
        reject({ status: 500, message: "database error" });
      }
    });
  }
  static findUserWithId(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await UserSchema.findOne({ _id: userId });
        if(!user) reject("user not found")
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  }
};

module.exports = User;
