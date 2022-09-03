const multer = require("multer");
const { storage } = require("../config/config");
const express = require("express");
const render = require("../tools/render");
const user = require("../mod/user");
const userCtrl = require("../mod/user");
const check = require("../mod/check");

const router = express.Router();

const upload = multer({ storage: storage });

router.post(
  "/uploadIMG",
  user.checkUploadIMG,
  upload.single("picture"),
  user.uploadIMG
);

router.get("/userMessage", user.getMessage);

router.post("/records", user.getRecording);

router.get("/myuser", userCtrl.findMyUser);

router.get("/user/:username", userCtrl.findUserByName);
// 冒号后跟着的表示传入参数，这里username是形参，与req.params中的内容对应
// 比如这里如果请求地址是/user/MillNasis，在req.params.username中可以拿到MillNasis

router.put("/user/:username", userCtrl.updateUserInfo);

router.put("/deleteFriend", userCtrl.deleteFriend);

router.get("/group/:groupid", userCtrl.findGroupById);

router.put("/group/:groupid", userCtrl.updateGroupInfo);

router.delete(
  "/group/:groupid",

  check.deleteGroupCheck,
  userCtrl.deleteGroup
);

router.post("/group", userCtrl.newRoomHandle);

router.get("/search/:mode", userCtrl.search);

router.post(
  "/message",

  check.sendMessageCheck,
  userCtrl.sendMessage
);

router.put("/message", userCtrl.handleMessage);
router.get("/login", userCtrl.loginPage);

router.post("/login", check.loginCheck, userCtrl.loginHandle);

router.post("/register", check.registerCheck, userCtrl.registerHandle);

router.get("/logout", userCtrl.logoutHandle);

router.get("/cal", userCtrl.calMark);

module.exports = router;
