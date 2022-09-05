const express = require("express");
const router = express.Router();
const userCtrl = require("../mod/user");
const check = require("../mod/check");
const socketRouter = require("./socketRouter");
const apiRouter = require("./apiRouter");
const db = require("../mod/index");

module.exports = (io) => {
  socketRouter(io);

  router.use("/api", apiRouter);

  router.get("/", userCtrl.mainIndex);

  router.get("/login", userCtrl.loginPage);

  return router;
};
