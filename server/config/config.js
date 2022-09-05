const multer = require("multer");
let storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./public/img/upload");
    //destination中的回调函数第二个参数是文件的储存位置
  },
  filename: function(req, file, callback) {
    let filename =
      req.session.user.username + req.session.user._id + file.originalname;
    req.fileurl = "/public/img/upload/" + filename;
    callback(null, filename);
    //filename中的回调函数的第二个参数是文件最终的名字，file.originalname是原文件名，file自带的属性
  },
});
module.exports = {
  dbURL: "mongodb://localhost:27017/",
  uuid: "290effd5-017a-41f6-a6b1-a2773d8d4c00",
  storage: storage,
};
