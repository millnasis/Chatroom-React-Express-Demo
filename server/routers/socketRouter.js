const db = require("../mod/index");
const moment = require("moment");
const { momentFormat } = require("../../constant");
module.exports = (io) => {
  const transitMessage = io.of("/transitMessage");
  const groupTalk = io.of("/group");
  const singleTalk = io.of("/single");

  transitMessage.on("connection", async (socket) => {
    socket.on("username", (username) => {
      console.log(username + "上线了");
      socket.join(username);
    });
    socket.on("message", (username) => {
      transitMessage.to(username).emit("message", "新消息");
    });
  });

  groupTalk.on("connection", async (socket) => {
    const records = (await db).collection("records");

    let roomName = null;
    socket.on("room", (data) => {
      console.log(data);
      roomName = data;
      socket.join(roomName);
      socket.emit("tips", "欢迎，您已进入" + roomName);
    });

    socket.on("message", async (data) => {
      try {
        const users = (await db).collection("users");
        if (roomName) {
          await records.updateOne(
            { room_id: roomName },
            {
              $push: {
                recording: {
                  ...data,
                  time: new Date(data.time),
                },
              },
            }
          );
          const userObj = await users
            .aggregate([
              {
                $match: { username: data.username },
              },
              {
                $project: {
                  group: 0,
                  message: 0,
                  friend: 0,
                },
              },
            ])
            .toArray();
          if (userObj.length === 0) {
            throw Error;
          }
          groupTalk
            .to(roomName)
            .emit("message", { ...data, userObj: userObj[0] });
        }
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("delete", (data) => {
      if (roomName) {
        groupTalk.to(roomName).emit("delete", data);
      }
    });

    socket.on("update", (data) => {
      if (roomName) {
        console.log("有更新", data);
        groupTalk.to(roomName).emit("update", data);
      }
    });
  });

  singleTalk.on("connection", async (socket) => {
    const records = (await db).collection("records");

    let roomName = null;
    socket.on("room", (data) => {
      console.log(data);
      roomName = data;
      socket.join(roomName);
      socket.emit("tips", "欢迎，您已进入" + roomName);
    });

    socket.on("message", async (data) => {
      try {
        const users = (await db).collection("users");
        if (roomName) {
          await records.updateOne(
            { room_id: roomName },
            {
              $push: {
                recording: {
                  ...data,
                  time: new Date(data.time),
                },
              },
            }
          );
          const userObj = await users
            .aggregate([
              {
                $match: { username: data.username },
              },
              {
                $project: {
                  group: 0,
                  message: 0,
                  friend: 0,
                },
              },
            ])
            .toArray();
          if (userObj.length === 0) {
            throw Error;
          }
          singleTalk
            .to(roomName)
            .emit("message", { ...data, userObj: userObj[0] });
        }
      } catch (error) {
        console.error(error);
      }
    });
    socket.on("delete", (data) => {
      if (roomName) {
        singleTalk.to(roomName).emit("delete", data);
      }
    });
  });
};
