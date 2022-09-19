// 获取副作用函数
import { put, take, call } from "redux-saga/effects";
// 异步封装
import axios from "axios";

import io from "socket.io-client";

// 从reducer中获取actionsType，同时包含返回数据的action生成器也由reducer提供
import { actionsType, actions } from "../redux/chatroom.js";
import { actions as rootActions } from "../redux/root.js";
const { socket_tips, socket_delete, socket_message, socket_update } = actions;

import store from "../redux/store.js";

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
          e.showMSG = e.record;
          let count = 0;
          e.record.forEach((el) => {
            if (el.username !== action.userInfo.username) {
              count++;
            }
          });
          e.count = count;
          delete e.record;
          const recordName =
            (e.private ? "private" : "public") + e.sort + e.room_id;
          const { chatroom } = store.getState();
          const { registerRoomRecord } = chatroom;
          // console.log(registerRoomRecord, recordName);
          if (!registerRoomRecord.has(recordName)) {
            e.socket.on("tips", function (data) {
              store.dispatch(socket_tips(e.private, e.sort, e.room_id, data));
            });
            e.socket.on("message", function (data) {
              store.dispatch(
                socket_message(
                  e.private,
                  e.sort,
                  e.room_id,
                  data,
                  action.userInfo
                )
              );
            });
            e.socket.on("delete", function (data) {
              store.dispatch(socket_delete(e.private, e.sort, e.room_id, data));
            });
            e.socket.on("update", function (data) {
              store.dispatch(socket_update(e.private, e.sort, e.room_id, data));
            });
            registerRoomRecord.add(recordName);
          }
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

export function* sendToGetRecord() {
  while (true) {
    try {
      const action = yield take(actionsType.SEND_TO_GET_RECORD);
      const { privateSign, sort, name, limit, skip } = action;
      const response = yield call(axios.post, "/api/records", {
        room_id: name,
        skip,
        limit,
      });
      if (response && response.status === 200) {
        yield put(
          actions.response_record(
            privateSign,
            sort,
            name,
            response.data.length === 0
              ? [
                  {
                    content: "已无更多记录",
                    userObj: { username: "系统消息" },
                    sys: true,
                  },
                ]
              : response.data.map((v) => {
                  return v.recording;
                })
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export function* sendToChangeSort() {
  while (true) {
    try {
      const action = yield take(actionsType.SEND_TO_CHANGE_SORT);
      const { new_sort, group_id } = action;
      const response = yield call(axios.put, "/api/sort", {
        new_sort,
        group_id,
      });
      if (response && response.status === 200) {
        yield put(actions.close_window());
        yield put(rootActions.get_user_info(true, true));
      }
    } catch (error) {
      console.error(error);
    }
  }
}
