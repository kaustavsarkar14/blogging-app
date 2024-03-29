const express = require("express");
const AuthRouter = require("./Controllers/AuthController.js");
require("dotenv").config();
const session = require("express-session");
const BlogRouter = require("./Controllers/BlogController.js");
const isAuth = require("./Middlewares/AuthMiddleware.js");
const FollowRouter = require("./Controllers/FollowControllers.js");
const mongoDbSession = require("connect-mongodb-session")(session);

// file imports
require("./db.js");

// consts
const app = express();
const store = new mongoDbSession({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

// middlewares
app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use("/auth", AuthRouter);
app.use("/blog", isAuth, BlogRouter);
app.use("/follow", isAuth, FollowRouter);

app.listen(process.env.PORT, () => {
  console.log("server is running");
});
