const db = require("./index");
const render = require("../tools/render");
const constant = require("../../constant/index");
const { totalGrouprMsg, totalResult, totalUserMsg, totalIdentity } = constant;
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
  let from, to;
  if (req.session.user.username === req.body.user_a) {
    (from = req.body.user_a), (to = req.body.user_b);
  } else {
    (from = req.body.user_b), (to = req.body.user_a);
  }
  let deleteMessage = {
    messageType: "deleteFriend",
    result: totalResult.CONFIRM_BACK,
    from,
    to,
    read: false,
    private: true,
    date: new Date(),
  };
  let ret3 = await group.deleteOne({ room_id: room.room_id });
  let ret4 = await records.deleteOne({ room_id: room.room_id });
  if (req.session.user.username === req.body.user_a) {
    await users.updateOne(
      { username: req.body.user_a },
      {
        $pull: { group: { group_id: room.room_id }, friend: req.body.user_b },
      }
    );
    await users.updateOne(
      { username: req.body.user_b },
      {
        $pull: { group: { group_id: room.room_id }, friend: req.body.user_a },
        $push: { message: deleteMessage },
      }
    );
  } else {
    await users.updateOne(
      { username: req.body.user_a },
      {
        $pull: { group: { group_id: room.room_id }, friend: req.body.user_b },
        $push: { message: deleteMessage },
      }
    );
    await users.updateOne(
      { username: req.body.user_b },
      {
        $pull: { group: { group_id: room.room_id }, friend: req.body.user_a },
      }
    );
  }

  res.send(room);
};

exports.handleMessage = async (req, res, next) => {
  try {
    let users = (await db).collection("users");
    let group = (await db).collection("group");
    let records = (await db).collection("records");
    if (req.body.notice.messageType === totalGrouprMsg.JOIN_GROUP) {
      if (req.body.result === totalResult.CONFIRM) {
        await users.updateOne(
          { username: req.body.notice.from },
          {
            $push: {
              group: {
                sort: "未分组",
                group_id: req.body.notice.room_id,
                private: false,
              },
              message: {
                result: totalResult.CONFIRM_BACK,
                messageType: req.body.notice.messageType,
                from: req.body.notice.to,
                to: req.body.notice.from,
                room_id: req.body.notice.room_id,
                private: false,
                read: false,
                date: new Date(),
              },
            },
          }
        );
        await group.updateOne(
          { room_id: req.body.notice.room_id },
          { $push: { member: req.body.notice.from } }
        );
        await users.updateOne(
          { username: req.body.notice.to },
          {
            $set: {
              "message.$[elem].read": true,
            },
          },
          {
            arrayFilters: [
              {
                "elem.from": req.body.notice.from,
                "elem.to": req.body.notice.to,
                "elem.messageType": req.body.notice.messageType,
              },
            ],
          }
        );
      } else if (req.body.result === totalResult.DENY) {
        await users.updateOne(
          { username: req.body.notice.to },
          {
            $set: {
              "message.$[elem].read": true,
            },
          },
          {
            arrayFilters: [
              {
                "elem.from": req.body.notice.from,
                "elem.to": req.body.notice.to,
                "elem.messageType": req.body.notice.messageType,
              },
            ],
          }
        );

        await users.updateOne(
          { username: req.body.notice.from },
          {
            $push: {
              message: {
                result: totalResult.DENY_BACK,
                messageType: req.body.notice.messageType,
                from: req.body.notice.to,
                to: req.body.notice.from,
                room_id: req.body.notice.room_id,
                private: false,
                read: false,
                date: new Date(),
              },
            },
          }
        );
      } else if (
        req.body.result === totalResult.CONFIRM_BACK ||
        req.body.result === totalResult.DENY_BACK
      ) {
        await users.updateOne(
          { username: req.session.user.username },
          {
            $set: {
              "message.$[elem].read": true,
            },
          },
          {
            arrayFilters: [
              {
                "elem.from": req.body.notice.from,
                "elem.to": req.body.notice.to,
                "elem.result": req.body.result,
                "elem.messageType": req.body.notice.messageType,
              },
            ],
          }
        );
      }
      res.send("OK");
    } else if (req.body.notice.messageType === totalUserMsg.ADD_FRIEND) {
      if (req.body.result === totalResult.CONFIRM) {
        let nowDate = new Date();
        let group_id =
          req.body.notice.from +
          "_" +
          req.body.notice.to +
          "_" +
          nowDate.getTime();
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
          private: true,
        });
        let ret4 = await users.updateOne(
          { username: req.session.user.username },
          {
            $set: {
              "message.$[elem].read": true,
            },
          },
          {
            arrayFilters: [
              {
                "elem.from": req.body.notice.from,
                "elem.to": req.body.notice.to,
                "elem.messageType": req.body.notice.messageType,
              },
            ],
          }
        );
        let ret5 = await users.updateOne(
          { username: req.body.notice.from },
          {
            $push: {
              message: {
                result: totalResult.CONFIRM_BACK,
                messageType: req.body.notice.messageType,
                from: req.body.notice.to,
                to: req.body.notice.from,
                read: false,
                private: true,
                date: new Date(),
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
            nowDate.getTime(),
          recording: [],
        });
        res.send("OK");
      } else if (
        req.body.result === totalResult.CONFIRM_BACK ||
        req.body.result === totalResult.DENY_BACK
      ) {
        await users.updateOne(
          { username: req.session.user.username },
          {
            $set: {
              "message.$[elem].read": true,
            },
          },
          {
            arrayFilters: [
              {
                "elem.from": req.body.notice.from,
                "elem.to": req.body.notice.to,
                "elem.result": req.body.result,
                "elem.messageType": req.body.notice.messageType,
              },
            ],
          }
        );
        res.send("OK");
      } else if (req.body.result === totalResult.DENY) {
        await users.updateOne(
          { username: req.session.user.username },
          {
            $set: {
              "message.$[elem].read": true,
            },
          },
          {
            arrayFilters: [
              {
                "elem.from": req.body.notice.from,
                "elem.to": req.body.notice.to,
                "elem.messageType": req.body.notice.messageType,
              },
            ],
          }
        );
        await users.updateOne(
          { username: req.body.notice.from },
          {
            $push: {
              message: {
                result: totalResult.DENY_BACK,
                messageType: req.body.notice.messageType,
                from: req.body.notice.to,
                to: req.body.notice.from,
                private: true,
                date: new Date(),
              },
            },
          }
        );
        res.send("OK");
      }
    } else if (req.body.notice.messageType === totalUserMsg.DELETE_FRIEND) {
      let ret3 = users.updateOne(
        { username: req.session.user.username },
        {
          $set: {
            "message.$[elem].read": true,
          },
        },
        {
          arrayFilters: [
            {
              "elem.from": req.body.notice.from,
              "elem.to": req.body.notice.to,
              "elem.result": req.body.result,
              "elem.messageType": req.body.notice.messageType,
            },
          ],
        }
      );
      res.send("OK");
    } else if (req.body.notice.messageType === totalGrouprMsg.INVITE_GROUP) {
      if (req.body.result === totalResult.CONFIRM) {
        await users.updateOne(
          { username: req.body.notice.to },
          {
            $set: {
              "message.$[elem].read": true,
            },
            $push: {
              group: {
                sort: "未分组",
                group_id: req.body.notice.room_id,
                private: false,
              },
            },
          },
          {
            arrayFilters: [
              {
                "elem.from": req.body.notice.from,
                "elem.to": req.body.notice.to,
                "elem.messageType": req.body.notice.messageType,
              },
            ],
          }
        );
        await group.updateOne(
          {
            room_id: req.body.notice.room_id,
          },
          {
            $push: {
              member: req.body.notice.to,
            },
          }
        );
        await users.updateOne(
          {
            username: req.body.notice.from,
          },
          {
            $push: {
              message: {
                result: totalResult.CONFIRM_BACK,
                messageType: req.body.notice.messageType,
                from: req.body.notice.to,
                to: req.body.notice.from,
                room_id: req.body.notice.room_id,
                private: false,
                read: false,
                date: new Date(),
              },
            },
          }
        );
        res.send("OK");
      } else if (req.body.result === totalResult.DENY) {
        await users.updateOne(
          { username: req.body.notice.to },
          { $set: { "message.$[elem].read": true } },
          {
            arrayFilters: [
              {
                "elem.from": req.body.notice.from,
                "elem.to": req.body.notice.to,
                "elem.messageType": req.body.notice.messageType,
              },
            ],
          }
        );
        await users.updateOne(
          {
            username: req.body.notice.from,
          },
          {
            $push: {
              message: {
                result: totalResult.DENY_BACK,
                messageType: req.body.notice.messageType,
                from: req.body.notice.to,
                to: req.body.notice.from,
                room_id: req.body.notice.room_id,
                private: false,
                read: false,
                date: new Date(),
              },
            },
          }
        );
        res.send("OK");
      } else if (
        req.body.result === totalResult.CONFIRM_BACK ||
        req.body.result === totalResult.DENY_BACK
      ) {
        await users.updateOne(
          { username: req.session.user.username },
          {
            $set: {
              "message.$[elem].read": true,
            },
          },
          {
            arrayFilters: [
              {
                "elem.from": req.body.notice.from,
                "elem.to": req.body.notice.to,
                "elem.result": req.body.result,
                "elem.messageType": req.body.notice.messageType,
              },
            ],
          }
        );
        res.send("OK");
      }
    }
  } catch (error) {
    console.error(error);
  }
};

exports.sendMessage = async (req, res, next) => {
  let users = (await db).collection("users");
  let group = (await db).collection("group");
  const { room_id, from, to, messageType } = req.body;
  if (messageType === totalGrouprMsg.JOIN_GROUP) {
    const query = await group.find({ room_id }).toArray();
    if (query.length === 0) {
      res.status(500).send("群聊不存在");
      return;
    }
    let ret = await users.updateOne(
      { username: to },
      {
        $push: {
          message: {
            read: false,
            from,
            to,
            messageType,
            private: false,
            date: new Date(),
            room_id: query[0].room_id,
          },
        },
      }
    );
    console.log(ret);
    res.send("OK");
  } else if (messageType === totalUserMsg.ADD_FRIEND) {
    let ret = await users.updateOne(
      { username: to },
      {
        $push: {
          message: {
            read: false,
            from,
            to,
            messageType,
            private: true,
            date: new Date(),
          },
        },
      }
    );
    console.log(ret);
    res.send("OK");
  }
};

// exports.getMessage = async (req, res, next) => {
//   if (!req.session.user) {
//     res.status(403).send("无权限");
//     return;
//   }
//   let users = (await db).collection("users");
//   let ret = await users.find({ username: req.session.user.username }).toArray();
//   if (ret.length === 0) {
//     res.status(404).send("无用户");
//     return;
//   }
//   res.send(ret[0].message);
// };

exports.newRoomHandle = async (req, res, next) => {
  let group = (await db).collection("group");
  let users = (await db).collection("users");
  let records = (await db).collection("records");
  const { groupName, owner, inviteList, avatar, words } = req.body;
  let now = new Date();
  const room_id = owner + "_" + now.getTime();
  await group.insertOne({
    head_picture: avatar,
    room_name: groupName,
    private: false,
    room_id,
    owner: owner,
    foundtime: now,
    member: [owner],
    words,
  });
  await records.insertOne({
    room_id,
    recording: [],
  });
  // console.log(ret1);
  await users.updateOne(
    { username: owner },
    // mongodb内嵌数组的添加写法如下
    {
      $push: {
        group: {
          group_id: room_id,
          sort: "未分组",
          private: false,
        },
      },
    }
  );
  console.log(inviteList);
  if (Array.isArray(inviteList) && inviteList.length > 0) {
    await Promise.all(
      inviteList.map(async (v) => {
        const ret = await users.updateOne(
          {
            username: v,
          },
          {
            $push: {
              message: {
                read: false,
                messageType: totalGrouprMsg.INVITE_GROUP,
                from: req.session.user.username,
                to: v,
                room_id,
                private: false,
                date: new Date(),
              },
            },
          }
        );
        return ret;
      })
    );
  }
  // let ret = await users.find({ username: req.body.owner }).toArray();
  // req.session.user = ret[0];
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
    let ret = await users
      .aggregate([
        {
          $match: find,
        },
        {
          $skip: +req.query.skip,
        },
        {
          $limit: +req.query.limit,
        },
      ])
      .toArray();
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
    let ret1 = await group
      .aggregate([
        {
          $match: find1,
        },
        {
          $skip: +req.query.skip,
        },
        {
          $limit: +req.query.limit,
        },
      ])
      .toArray();
    console.log(ret1);
    let ret2 = await group
      .aggregate([
        {
          $match: find2,
        },
        {
          $skip: +req.query.skip,
        },
        {
          $limit: +req.query.limit,
        },
      ])
      .toArray();
    console.log(find2, ret2);
    let ret = ret1.concat(ret2);
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
  const find = {
    room_id: req.params.groupid,
  };
  const group = (await db).collection("group");
  const query = await group.find(find).toArray();
  if (query.length === 0) {
    res.status(500).send("群聊未找到");
    return;
  }
  if (query[0].owner !== req.session.user.username) {
    res.status(403).send("无权限");
    return;
  }
  if (req.body.deleteUser) {
    let ret = await group.updateOne(find, {
      $pull: { member: req.body.deleteUser },
    });
    console.log(ret);
    res.send("OK");
  } else {
    const { name, data } = req.body;
    let ret = await group.updateOne(find, {
      $set: {
        [name]: data,
      },
    });
    if (!ret) {
      res.status(500).send("服务端出错");
      return;
    }
    res.send(data);
  }
};

exports.findGroupById = async (req, res, next) => {
  let find = {
    room_id: req.params.groupid,
  };
  let groups = (await db).collection("group");
  const ret = await groups
    .aggregate([
      {
        $match: find,
      },
      {
        $lookup: {
          from: "users",
          localField: "member",
          foreignField: "username",
          as: "member",
        },
      },
    ])
    .toArray();
  if (ret.length === 0) {
    res.status(404).send("无房间");
    return;
  }
  ret[0].member = ret[0].member.map((v) => {
    delete v.group;
    delete v.message;
    delete v.friend;
    return v;
  });
  let identity = null;
  if (ret[0].owner === req.session.user.username) {
    identity = totalIdentity.OWNER;
  } else if (
    ret[0].member.find((v) => v.username === req.session.user.username)
  ) {
    identity = totalIdentity.FRIEND;
  } else {
    identity = totalIdentity.STRANGER;
  }
  res.send({
    groupInfo: ret[0],
    identity,
  });
};

function handleProject(name) {
  return {
    ["info." + name + ".group"]: 0,
    ["info." + name + ".message"]: 0,
    ["info." + name + ".friend"]: 0,
  };
}

exports.findGroupByUsername = async (req, res, next) => {
  try {
    const users = (await db).collection("users");
    const records = (await db).collection("records");
    const { username } = req.session.user;
    const ret1 = await users
      .aggregate([
        {
          $match: {
            username,
          },
        },
        {
          $project: {
            group: 1,
          },
        },
        {
          $unwind: "$group",
        },
        {
          $match: {
            "group.private": true,
          },
        },
        {
          $lookup: {
            from: "group",
            localField: "group.group_id",
            foreignField: "room_id",
            as: "info",
          },
        },
        {
          $unwind: "$info",
        },
        {
          $lookup: {
            from: "users",
            localField: "info.user_a",
            foreignField: "username",
            as: "info.user_a",
          },
        },
        {
          $unwind: "$info.user_a",
        },
        {
          $project: handleProject("user_a"),
        },
        {
          $lookup: {
            from: "users",
            localField: "info.user_b",
            foreignField: "username",
            as: "info.user_b",
          },
        },
        {
          $unwind: "$info.user_b",
        },
        {
          $project: handleProject("user_b"),
        },
      ])
      .toArray();
    console.log(ret1);
    const ret2 = await users
      .aggregate([
        {
          $match: {
            username,
          },
        },
        {
          $project: {
            group: 1,
          },
        },
        {
          $unwind: "$group",
        },
        {
          $match: {
            "group.private": false,
          },
        },
        {
          $lookup: {
            from: "group",
            localField: "group.group_id",
            foreignField: "room_id",
            as: "info",
          },
        },
        {
          $unwind: "$info",
        },
        {
          $lookup: {
            from: "users",
            localField: "info.member",
            foreignField: "username",
            as: "info.member",
          },
        },
      ])
      .toArray();
    let ret = ret1.concat(ret2);
    ret = await Promise.all(
      ret.map(async (v) => {
        let record = await records
          .aggregate([
            {
              $match: {
                room_id: v.group.group_id,
              },
            },
            {
              $project: {
                recording: 1,
              },
            },
            {
              $unwind: "$recording",
            },
            {
              $match: {
                "recording.time": {
                  $gte: new Date(req.session.user.last),
                },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "recording.username",
                foreignField: "username",
                as: "recording.userObj",
              },
            },
          ])
          .toArray();

        record = record.map((v) => {
          return {
            ...v.recording,
            userObj: v.recording.userObj[0],
          };
        });
        if (v.info.private) {
          return {
            ...v.group,
            ...v.info,
            record,
            room_name:
              v.info.user_a.username === username
                ? v.info.user_b
                : v.info.user_a,
          };
        }
        return {
          ...v.group,
          ...v.info,
          record,
          member: v.info.member.map((v) => {
            delete v.group;
            delete v.message;
            delete v.friend;
            return v;
          }),
        };
      })
    );
    res.send(ret);
  } catch (error) {
    console.error(error);
    res.status(500).send("服务端出错");
  }
};

exports.changeSort = async (req, res, next) => {
  try {
    let users = (await db).collection("users");
    const { group_id, new_sort } = req.body;
    const ret = await users.updateOne(
      { username: req.session.user.username },
      {
        $set: {
          "group.$[elem].sort": new_sort,
        },
      },
      {
        arrayFilters: [
          {
            "elem.group_id": group_id,
          },
        ],
      }
    );
    res.send("OK");
  } catch (error) {
    res.status(500).send("服务端出错");
    console.error(error);
  }
};

exports.updateUserInfo = async (req, res, next) => {
  try {
    let users = (await db).collection("users");
    const { username } = req.params;
    const { name, data } = req.body;
    const ret = await users.updateOne(
      { username },
      {
        $set: {
          [name]: data,
        },
      }
    );
    if (!ret) {
      res.status(500).send("服务端出错");
      return;
    }
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("服务端出错");
  }
  // if (req.body.deleteGroup) {
  //   let find = {
  //     username: req.params.username,
  //   };
  //   let ret = await users.updateOne(find, {
  //     $pull: { group: { group_id: req.body.group.room_id } },
  //   });
  //   console.log(ret);
  //   let userInfo = await users
  //     .find({ username: req.params.username })
  //     .toArray();
  //   req.session.user = userInfo[0];
  //   res.send("OK");
  // } else if (req.body.group_name) {
  //   let find = {
  //     username: req.params.username,
  //     "group.group_id": req.body.room_id,
  //   };
  //   let ret = await users.updateOne(find, {
  //     $set: { "group.$.sort": req.body.group_name },
  //   });
  //   // 这里"group.$.sort"中的$表示匹配到的数组中的第一个元素
  //   console.log(ret);
  //   let userInfo = await users
  //     .find({ username: req.params.username })
  //     .toArray();
  //   req.session.user = userInfo[0];
  //   res.send("OK");
  // } else {
  //   let find = {
  //     username: req.params.username,
  //   };
  //   let ret = await users.updateOne(find, {
  //     $set: {
  //       username: req.body.username,
  //       words: req.body.words,
  //       head_picture: req.body.head_picture,
  //       age: req.body.age,
  //       sex: req.body.sex,
  //     },
  //   });
  //   console.log(ret);
  //   let userInfo = await users
  //     .find({ username: req.params.username })
  //     .toArray();
  //   req.session.user = userInfo[0];
  //   res.send("OK");
  // }
};

exports.findMyUser = async (req, res, next) => {
  if (!req.session.user) {
    res.status(403).send("未登录");
    return;
  }
  const user = (await db).collection("users");
  const group = (await db).collection("group");
  try {
    let userInfo = await user
      .aggregate([
        {
          $match: {
            username: req.session.user.username,
          },
        },
      ])
      .toArray();
    if (userInfo.length === 0) {
      throw Error;
    }
    let messageArr = await user
      .aggregate([
        {
          $match: {
            username: req.session.user.username,
          },
        },
        {
          $project: {
            message: 1,
            username: 1,
          },
        },
        {
          $unwind: "$message",
        },
        {
          $sort: {
            date: -1,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "message.from",
            foreignField: "username",
            as: "message.from",
          },
        },
        {
          $unwind: "$message.from",
        },
        {
          $group: {
            _id: "$username",
            message: {
              $push: "$message",
            },
          },
        },
      ])
      .toArray();
    if (messageArr.length > 0) {
      const msg = await Promise.all(
        messageArr[0].message.map(async (v) => {
          if (!v.room_id) {
            return v;
          } else {
            const room = await group.find({ room_id: v.room_id }).toArray();
            return {
              ...v,
              room: room[0],
            };
          }
        })
      );
      userInfo[0].message = msg;
      console.log(msg, messageArr[0].message);
    }
    req.session.user = userInfo[0];
    await user.updateOne(
      { username: req.session.user.username },
      { $set: { last: new Date() } }
    );
    res.send(req.session.user);
  } catch (error) {
    console.error(error);
    res.status(404).send("userexist");
    // 返回错误的状态码会让客户端的ajax报错
  }
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
  let identity;
  if (ret[0].username === req.session.user.username) {
    identity = totalIdentity.ME;
  } else if (
    ret[0].friend.findIndex((v) => v === req.session.user.username) !== -1
  ) {
    identity = totalIdentity.FRIEND;
  } else {
    identity = totalIdentity.STRANGER;
  }
  res.send({
    userInfo: ret[0],
    identity,
  });
};

exports.mainIndex = async (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/login");
    return;
  }
  let ret = await render("index.html");
  res.send(ret);
};

exports.loginPage = async (req, res, next) => {
  if (req.session.user) {
    res.redirect("/");
    return;
  }
  let ret = await render("index.html");
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
    res.send(userInfo[0]);
  } catch (error) {
    res.status(404).send("userexist");
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
      head_picture: "/public/img/default-avatar.jpg",
      words: "无",
      group: [],
      message: [],
      friend: [],
      age: "0",
      foundtime: new Date(),
      sex: "男",
      area: ["中国"],
      birthday: "无",
      email: "无",
      cover: "/public/img/default-cover.png",
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
  delete req.session.user;
  setTimeout(() => res.redirect("/login"), 300);
};

exports.uploadIMG = async (req, res, next) => {
  res.send(req.fileurl);
};

exports.uploadImgWang = async (req, res, next) => {
  res.send({
    errno: 0, // 注意：值是数字，不能是字符串
    data: {
      url: req.fileurl,
    },
  });
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
      { $match: { room_id: req.body.room_id } },
      { $unwind: "$recording" },
      { $project: { recording: 1 } },
      { $sort: { "recording.time": -1 } },
      // $sort 对象中的key表示排序的根据，后面1和-1表示升序和降序
      { $skip: +req.body.skip },
      { $limit: +req.body.limit },
      {
        $lookup: {
          from: "users",
          localField: "recording.username",
          foreignField: "username",
          as: "recording.userObj",
        },
      },
      {
        $unwind: "$recording.userObj",
      },
    ])
    .toArray();
  // 与find一样，必须使用toArray()
  res.send(ret);
};
/*db.group.aggregate([
  {$unwind:"$recording"},
  {$match:{room_id:"kkk_MillNasis_1628665312480"}},
  {$project:{"recording":1}},
  {$skip:3},
  {$limit:1}]).pretty()*/

exports.calMark = async (req, res, next) => {
  let ret = await render("calMark.html");
  res.send(ret);
};
