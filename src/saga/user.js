// 获取副作用函数
import { put, take, call } from "redux-saga/effects";
// 异步封装
import axios from "axios";
import { actionsType, actions } from "../redux/root.js";
import { actions as chatroomActions } from "../redux/chatroom.js";

export function* getUserInfo() {
  while (true) {
    const action = yield take(actionsType.SEND_TO_GET_USER_INFO);
    try {
      const response = yield call(axios.get, "/api/myuser");
      if (response && response.status === 200) {
        yield put(actions.response_user_info(response.data));
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
        yield put(actions.get_user_info());
      }
    } catch (error) {
      console.log(error);
    }
  }
}
