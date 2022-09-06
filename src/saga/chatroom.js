// 获取副作用函数
import { put, take, call } from "redux-saga/effects";
// 异步封装
import axios from "axios";

import io from "socket.io-client";

// 从reducer中获取actionsType，同时包含返回数据的action生成器也由reducer提供
import { actionsType, actions } from "../redux/chatroom.js";
const { socket_tips, socket_delete, socket_message, socket_update } = actions;

export function* sendToGetGroup() {
  while (true) {
    try {
      const action = yield take(actionsType.SEND_TO_GET_GROUP_ARRAY);
      const response = yield call(axios.get, "/api/group");
      if (response && response.status === 200) {
        const friendArray = [],
          groupArray = [];
        response.data.forEach((e) => {
          e.socket = e.private ? io("/single") : io("/group");
          e.socket.emit("room", e.room_id);
          e.showMSG = [];
          e.socket.on("tips", function* (data) {
            yield put(socket_tips(e.private, e.room_id, data));
          });
          e.socket.on("message", function* (data) {
            yield put(socket_message(e.private, e.room_id, data));
          });
          e.socket.on("delete", function* (data) {
            yield put(socket_delete(e.private, e.room_id, data));
          });
          e.socket.on("update", function* (data) {
            yield put(socket_update(e.private.e.room_id, data));
          });
          if (e.private) {
            friendArray.push(e);
          } else {
            groupArray.push(e);
          }
        });
        yield put(actions.response_group({ friendArray, groupArray }));
      }
    } catch (error) {
      console.error(error);
    }
  }
}
