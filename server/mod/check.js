const db = require("./index");

exports.session = async (req, res, next) => {
  if (!req.session.user) {
    res.status(403).send("无权限");
    return;
  }
  next();
};

exports.sendMessageCheck = async (req, res, next) => {
  let users = (await db).collection("users");
  let username = req.body.owner ? req.body.owner : req.body.to;
  console.log("username:" + username);
  let ret = await users.find({ username: username }).toArray();
  if (ret.length === 0) {
    res.status(404).send("群不存在");
    return;
  }
  let find = false;
  console.log(ret[0].message, req.body);
  ret[0].message.forEach((element) => {
    if (
      element.messageType === req.body.messageType &&
      element.from === req.body.from &&
      element.to === req.body.to
    ) {
      find = true;
    }
  });
  if (find) {
    res.status(403).send("请求已存在，请等待回应");
    return;
  }
  next();
};

exports.registerCheck = async (req, res, next) => {
  let permit = (await db).collection("permit");
  let ret = await permit
    .find({
      username: req.body.username,
    })
    .toArray();
  if (ret.length != 0) {
    res.status(500).send("用户已存在");
    return;
  }
  next();
};

exports.loginCheck = async (req, res, next) => {
  let permit = (await db).collection("permit");
  let ret = await permit.find({ username: req.body.username }).toArray();
  console.log(ret);
  if (ret.length === 0) {
    res.status(404).send("username");
    return;
  } else if (ret[0].password != req.body.password) {
    res.status(403).send("password");
    return;
  }
  next();
};

exports.deleteGroupCheck = async (req, res, next) => {
  let group = (await db).collection("group");
  console.log(req.body);
  let ret = await group.find({ room_id: req.body.room_id }).toArray();
  console.log(ret);
  if (ret.length === 0) {
    res.status(404).send("无此群");
    return;
  }
  if (ret[0].owner != req.session.user.username) {
    res.status(403).send("无权限");
    return;
  }
  next();
};
