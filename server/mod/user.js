const db = require("./index");
const render = require("../tools/render");
// 读取内嵌数组的内容，并可以分页
/*db.group.aggregate([
  {$unwind:"$recording"},
  {$match:{room_id:"kkk_MillNasis_1628665312480"}},
  {$project:{"recording":1}},
  {$skip:3},
  {$limit:1}]).pretty()*/
// aggregate==>传入一个数组，数组每个成员是对象，按照对象的顺序来执行里面的内容
// $unwind:$recording ==>一个对象中含有recording数组的情况，按照recording数组中的n个成员个数把该对象分为n个不同的对象，每个对象占有recording数组中的一个成员
// $match：{条件} ==>把所有记录按照match的条件筛选出来
// $project:{条件}==>只保留value为1的key对应的内容
// $skip:number ==>跳过number条记录
// $limit:number ==>从当前位置读出number条记录

function unique(arr) {
  // 数组去重方法
  for (var i = 0; i < arr.length; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[i].room_name === arr[j].room_name) {
        //第一个等同于第二个，splice方法删除第二个
        arr.splice(j, 1);
        j--;
      }
    }
  }
  return arr;
}

exports.deleteFriend = async (req, res, next) => {
  let group = (await db).collection("group");
  let users = (await db).collection("users");
  let records = (await db).collection("records");
  let room = null;
  let room_id;
  let ret1 = await group
    .find({ user_a: req.body.user_a, user_b: req.body.user_b })
    .toArray();
  if (ret1.length === 0) {
    let ret2 = await group
      .find({ user_a: req.body.user_b, user_b: req.body.user_a })
      .toArray();
    if (ret2.length === 0) {
      res.status(404).send("无此房间");
      return;
    }
    room = ret2[0];
  } else {
    room = ret1[0];
  }
  let deleteMessage = {
    messageType: "deleteFriend",
    back: "back",
    from: req.body.user_a,
    to: req.body.user_b,
    head_picture:
      "/img/src=http___bpic.588ku.com_element_pic_19_03_13_827aa73e189f5ac60d83e11b7f816206.jpg&refer=http___bpic.588ku.jpg",
  };
  let ret3 = await group.deleteOne({ room_id: room.room_id });
  let ret4 = await records.deleteOne({ room_id: room.room_id });
  let ret5 = await users.updateOne(
    { username: req.body.user_a },
    {
      $pull: { group: { group_id: room.room_id }, friend: req.body.user_b },
      $push: { message: deleteMessage },
    }
  );
  let ret6 = await users.updateOne(
    { username: req.body.user_b },
    {
      $pull: { group: { group_id: room.room_id }, friend: req.body.user_a },
      $push: { message: deleteMessage },
    }
  );
  res.send(room);
};

exports.handleMessage = async (req, res, next) => {
  let users = (await db).collection("users");
  let group = (await db).collection("group");
  let records = (await db).collection("records");
  if (req.body.notice.messageType === "joinGroup") {
    if (req.body.result === "confirm") {
      let ret1 = await users.updateOne(
        { username: req.body.notice.from },
        {
          $push: {
            group: {
              sort: "未分组",
              group_id: req.body.notice.to,
              private: false,
            },
          },
        }
      );
      let ret2 = await group.updateOne(
        { room_id: req.body.notice.to },
        { $push: { member: req.body.notice.from } }
      );
      let ret4 = users.updateOne(
        { username: req.body.notice.from },
        {
          $push: {
            message: {
              back: "back",
              messageType: req.body.notice.messageType,
              from: req.body.notice.from,
              to: req.body.notice.to,
              owner: req.body.notice.owner,
              room_name: req.body.notice.room_name,
              head_picture: req.body.notice.head_picture,
            },
          },
        }
      );
      console.log(ret1, ret2);
    }
    let ret3 = users.updateOne(
      { username: req.session.user.username },
      { $pull: { message: req.body.notice } }
    );
    let ret = await users
      .find({ username: req.session.user.username })
      .toArray();
    req.session.user = ret[0];
    res.send("OK");
  } else if (req.body.notice.messageType === "addFriend") {
    if (req.body.result === "confirm") {
      let nowDate = Date.now();
      let group_id =
        req.body.notice.from +
        "_" +
        req.body.notice.to +
        "_" +
        nowDate.toString();
      let ret1 = await users.updateOne(
        { username: req.body.notice.from },
        {
          $push: {
            group: { sort: "未分组", group_id: group_id, private: true },
            friend: req.body.notice.to,
          },
        }
      );
      let ret2 = await users.updateOne(
        { username: req.body.notice.to },
        {
          $push: {
            group: { sort: "未分组", group_id: group_id, private: true },
            friend: req.body.notice.from,
          },
        }
      );
      let ret3 = await group.insertOne({
        foundtime: nowDate,
        room_id: group_id,
        user_a: req.body.notice.to,
        user_b: req.body.notice.from,
        user_a_head_picture: req.body.notice.to_head_picture,
        user_b_head_picture: req.body.notice.head_picture,
        private: true,
      });
      let ret4 = users.updateOne(
        { username: req.session.user.username },
        { $pull: { message: req.body.notice } }
      );
      let ret5 = users.updateOne(
        { username: req.body.notice.from },
        {
          $push: {
            message: {
              back: "back",
              messageType: req.body.notice.messageType,
              from: req.body.notice.from,
              to: req.body.notice.to,
              head_picture: req.body.notice.head_picture,
            },
          },
        }
      );
      let ret6 = await records.insertOne({
        room_id:
          req.body.notice.from +
          "_" +
          req.body.notice.to +
          "_" +
          nowDate.toString(),
        recording: [],
      });
      let ret = await users
        .find({ username: req.session.user.username })
        .toArray();
      req.session.user = ret[0];
      res.send("OK");
    } else if (req.body.result === "confirmBack") {
      let ret3 = users.updateOne(
        { username: req.session.user.username },
        { $pull: { message: req.body.notice } }
      );
      let ret = await users
        .find({ username: req.session.user.username })
        .toArray();
      req.session.user = ret[0];
      res.send("OK");
    }
  } else if (req.body.notice.messageType === "deleteFriend") {
    let ret3 = users.updateOne(
      { username: req.session.user.username },
      { $pull: { message: req.body.notice } }
    );
    let ret = await users
      .find({ username: req.session.user.username })
      .toArray();
    req.session.user = ret[0];
    res.send("OK");
  }
};

exports.sendMessage = async (req, res, next) => {
  let users = (await db).collection("users");
  if (req.body.messageType === "joinGroup") {
    let ret = await users.updateOne(
      { username: req.body.owner },
      { $push: { message: req.body } }
    );
    console.log(ret);
    res.send("OK");
  } else if (req.body.messageType === "addFriend") {
    let ret = await users.updateOne(
      { username: req.body.to },
      { $push: { message: req.body } }
    );
    console.log(ret);
    res.send("OK");
  }
};

exports.getMessage = async (req, res, next) => {
  if (!req.session.user) {
    res.status(403).send("无权限");
    return;
  }
  let users = (await db).collection("users");
  let ret = await users.find({ username: req.session.user.username }).toArray();
  if (ret.length === 0) {
    res.status(404).send("无用户");
    return;
  }
  res.send(ret[0].message);
};

exports.newRoomHandle = async (req, res, next) => {
  let group = (await db).collection("group");
  let users = (await db).collection("users");
  let records = (await db).collection("records");
  let now = Date.now();
  let ret1 = await group.insertOne({
    head_picture: "/img/logo.png",
    room_name: req.body.groupName,
    private: false,
    room_id: req.body.owner + "_" + now.toString(),
    owner: req.body.owner,
    foundtime: now,
    member: [req.body.owner],
  });
  let ret2 = await records.insertOne({
    room_id: req.body.owner + "_" + now.toString(),
    recording: [],
  });
  console.log(ret1);
  let ret3 = await users.updateOne(
    { username: req.body.owner },
    // mongodb内嵌数组的添加写法如下
    {
      $push: {
        group: {
          group_id: req.body.owner + "_" + now.toString(),
          sort: "未分组",
          private: false,
        },
      },
    }
  );
  let ret = await users.find({ username: req.body.owner }).toArray();
  req.session.user = ret[0];
  res.send("创建成功");
};

exports.search = async (req, res, next) => {
  // 用new RegExp来生成可以传入参数的正则表达式
  if (req.params.mode === "single") {
    let find = {
      username: { $regex: req.query.word },
      // mongodb中如果想要进行包含查询，那么需要使用{$regex:正则或者字符串} 这样的形式
    };
    let users = (await db).collection("users");
    let ret = await users.find(find).toArray();
    if (ret.length === 0) {
      res.status(404).send("搜索无结果");
      return;
    }
    res.send(ret);
  } else if (req.params.mode === "group") {
    let find1 = {
      room_name: { $regex: req.query.word },
    };
    let find2 = {
      owner: { $regex: req.query.word },
    };
    let group = (await db).collection("group");
    let ret1 = await group.find(find1).toArray();
    console.log(ret1);
    let ret2 = await group.find(find2).toArray();
    console.log(find2, ret2);
    let ret = ret1.concat(ret2);
    ret = unique(ret);
    if (ret.length === 0) {
      res.status(404).send("搜索无结果");
      return;
    }
    res.send(ret);
  }
};

exports.deleteGroup = async (req, res, next) => {
  let group = (await db).collection("group");
  let records = (await db).collection("records");
  let ret = await group.deleteOne({ room_id: req.body.room_id });
  let ret2 = await records.deleteOne({ room_id: req.body.room_id });
  console.log(ret);
  res.send("OK");
};

exports.updateGroupInfo = async (req, res, next) => {
  let find = {
    room_id: req.params.groupid,
  };
  let group = (await db).collection("group");
  if (req.body.deleteUser) {
    let ret = await group.updateOne(find, {
      $pull: { member: req.body.deleteUser },
    });
    console.log(ret);
    res.send("OK");
  } else {
    let ret = await group.updateOne(find, {
      $set: {
        head_picture: req.body.head_picture,
        room_name: req.body.room_name,
      },
    });
    console.log(ret);
    res.send("OK");
  }
};

exports.findGroupById = async (req, res, next) => {
  let find = {
    room_id: req.params.groupid,
  };
  let groups = (await db).collection("group");
  let ret = await groups.find(find).toArray();
  if (ret.length === 0) {
    res.status(404).send("无房间");
  }
  res.send(ret[0]);
};

exports.updateUserInfo = async (req, res, next) => {
  let users = (await db).collection("users");
  if (req.body.deleteGroup) {
    let find = {
      username: req.params.username,
    };
    let ret = await users.updateOne(find, {
      $pull: { group: { group_id: req.body.group.room_id } },
    });
    console.log(ret);
    let userInfo = await users
      .find({ username: req.params.username })
      .toArray();
    req.session.user = userInfo[0];
    res.send("OK");
  } else if (req.body.group_name) {
    let find = {
      username: req.params.username,
      "group.group_id": req.body.room_id,
    };
    let ret = await users.updateOne(find, {
      $set: { "group.$.sort": req.body.group_name },
    });
    // 这里"group.$.sort"中的$表示匹配到的数组中的第一个元素
    console.log(ret);
    let userInfo = await users
      .find({ username: req.params.username })
      .toArray();
    req.session.user = userInfo[0];
    res.send("OK");
  } else {
    let find = {
      username: req.params.username,
    };
    let ret = await users.updateOne(find, {
      $set: {
        username: req.body.username,
        words: req.body.words,
        head_picture: req.body.head_picture,
        age: req.body.age,
        sex: req.body.sex,
      },
    });
    console.log(ret);
    let userInfo = await users
      .find({ username: req.params.username })
      .toArray();
    req.session.user = userInfo[0];
    res.send("OK");
  }
};

exports.findMyUser = async (req, res, next) => {
  console.log(req.session.user);
  res.send(req.session.user);
};

exports.findUserByName = async (req, res, next) => {
  let query = {
    username: req.params.username,
    // req.params.参数名 这样可以拿到路由地址传入的参数
  };
  let user = (await db).collection("users");
  let ret = await user.find(query).toArray();
  if (ret.length === 0) {
    // 检查数组是否为空的办法是查看length属性是否是0
    res.status(403).send("无用户");
    return;
  }
  res.send(ret[0]);
};

exports.mainIndex = async (req, res, next) => {
  // if (!req.session.user) {
  //   res.redirect("/login");
  //   return;
  // }
  let ret = await render("index.html");
  res.send(ret);
};

exports.loginPage = async (req, res, next) => {
  console.log(req.session);
  if (req.session.user) {
    res.redirect("/");
    return;
  }
  let ret = await render("LoginPage.html");
  res.send(ret);
};

exports.loginHandle = async (req, res, next) => {
  let user = (await db).collection("users");
  try {
    let userInfo = await user.find({ username: req.body.username }).toArray();
    if (userInfo.length === 0) {
      throw Error;
    }
    req.session.user = userInfo[0];
    res.send("OK");
  } catch (error) {
    res.status(404).send("用户不存在");
    // 返回错误的状态码会让客户端的ajax报错
  }
};

exports.registerHandle = async (req, res, next) => {
  try {
    let permit = (await db).collection("permit");
    let users = (await db).collection("users");
    let ret1 = await permit.insertOne({
      username: req.body.username,
      password: req.body.password,
    });
    console.log(ret1);
    let myUser = {
      username: req.body.username,
      permit: "user",
      head_picture: "/img/logo.png",
      words: "编辑个性签名",
      group: [],
      message: [],
      age: "0",
      foundtime: Date.now(),
      sex: "男",
    };
    let ret2 = await users.insertOne(myUser);
    console.log(ret2);
    req.session.user = myUser;
    res.send("OK");
  } catch (error) {
    console.log(error);
    res.status(500).send("错误");
  }
};

exports.logoutHandle = async (req, res, next) => {
  req.session.user = null;
  res.redirect("/login");
};

exports.uploadIMG = async (req, res, next) => {
  res.send(req.fileurl);
};

exports.checkUploadIMG = async (req, res, next) => {
  if (!req.session.user) {
    res.status(403).send("没有权限");
    return;
  }
  next();
};

exports.getRecording = async (req, res, next) => {
  let records = (await db).collection("records");
  let ret = await records
    .aggregate([
      { $unwind: "$recording" },
      { $match: { room_id: req.body.room_id } },
      { $project: { recording: 1 } },
      { $sort: { "recording.time": -1 } },
      // $sort 对象中的key表示排序的根据，后面1和-1表示升序和降序
      { $skip: req.body.skip },
      { $limit: req.body.limit },
    ])
    .toArray();
  // 与find一样，必须使用toArray()
  console.log(ret);
  res.send(ret);
};
/*db.group.aggregate([
  {$unwind:"$recording"},
  {$match:{room_id:"kkk_MillNasis_1628665312480"}},
  {$project:{"recording":1}},
  {$skip:3},
  {$limit:1}]).pretty()*/

exports.calMark = async (req, res, next) => {
  let ret = await render("calMark.html")
  res.send(ret);
};