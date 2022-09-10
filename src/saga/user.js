// 获取副作用函数
import { put, take, call } from "redux-saga/effects";
// 异步封装
import axios from "axios";
import { actionsType, actions } from "../redux/root.js";
import { actions as chatroomActions } from "../redux/chatroom.js";
import { actions as messageActions } from "../redux/message.js";
import { io } from "socket.io-client";
import store from "../redux/store.js";

export function* getUserInfo() {
  while (true) {
    const action = yield take(actionsType.SEND_TO_GET_USER_INFO);
    try {
      const response = yield call(axios.get, "/api/myuser");
      if (response && response.status === 200) {
        if (typeof action.msg === "undefined") {
          const socket = io("/transitMessage");
          socket.emit("username", response.data.username);
          socket.on("message", (data) => {
            store.dispatch(messageActions.socket_msg(data));
          });
          yield put(actions.response_socket(socket));
        }
        yield put(actions.response_user_info(response.data));
        if (response.data.message.length > 0) {
          yield put(messageActions.response_user_msg(response.data.message));
        }
        if (action.group) {
          yield put(chatroomActions.get_group());
        }
      }
    } catch (error) {
      yield put(actions.reset_user_info());
    }
  }
}

export function* sendLogout() {
  while (true) {
    const action = yield take(actionsType.SEND_TO_LOGOUT);
    try {
      const response = yield call(axios.get, "/api/logout");
      if (response && response.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  }
}
