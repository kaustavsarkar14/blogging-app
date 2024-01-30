const UserSchema = require("../Schema/UserSchema");

let User = class {
  constructor({ name, email, username, password }) {
    this.name = name;
    this.email = email;
    this.username = username;
    this.password = password;
  }
  register() {
    return new Promise(async (resolve, reject) => {
      const userObj = new UserSchema({
        name: this.name,
        email: this.email,
        username: this.username,
        password: this.password,
      });
      try {
        const userDb = await userObj.save();
        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }
};


module.exports = User