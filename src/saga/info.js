// 获取副作用函数
import { put, take, call } from "redux-saga/effects";
// 异步封装
import axios from "axios";

// 从reducer中获取actionsType，同时包含返回数据的action生成器也由reducer提供
import { actionsType, actions } from "../redux/info.js";
import { actions as rootActions } from "../redux/root.js";
import { totalUserMsg } from "../../constant/index.js";

export function* getTargetInfo() {
  while (true) {
    try {
      const action = yield take(actionsType.SEND_TO_GET_TARGET_INFO);
      const response = yield call(axios.get, "/api/user/" + action.username);
      if (response && response.status === 200) {
        yield put(
          actions.response_info(response.data.userInfo, response.data.identity)
        );
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export function* sendToAddFriend() {
  while (true) {
    try {
      const action = yield take(actionsType.SEND_TO_ADD_FRIEND);
      const { username, targetname } = action;
      const response = yield call(axios.post, "/api/message", {
        messageType: totalUserMsg.ADD_FRIEND,
        from: username,
        to: targetname,
      });
      if (response && response.status === 200) {
        yield put(rootActions.set_notification(0, "发送成功"));
      }
    } catch (error) {
      console.error(error);
    }
  }
}
export function* sendToDeleteFriend() {
  while (true) {
    try {
      const action = yield take(actionsType.SEND_TO_DELETE_FRIEND);
      const { username, targetname } = action;
      const response = yield call(axios.put, "/api/deleteFriend", {
        messageType: totalUserMsg.DELETE_FRIEND,
        user_a: username,
        user_b: targetname,
      });
      if (response && response.status === 200) {
        yield put(rootActions.set_notification(0, "发送成功"));
        yield put(rootActions.get_user_info(true, true));
      }
    } catch (error) {
      console.error(error);
    }
  }
}
