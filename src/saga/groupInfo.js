// 获取副作用函数
import { put, take, call } from "redux-saga/effects";
// 异步封装
import axios from "axios";

// 从reducer中获取actionsType，同时包含返回数据的action生成器也由reducer提供
import { actionsType, actions } from "../redux/groupInfo.js";
import { actions as rootActions } from "../redux/root.js";
import { totalGrouprMsg, totalUserMsg } from "../../constant/index.js";
import {} from "../../constant/index.js";

export function* sendToGetGroupInfo() {
  while (true) {
    try {
      const action = yield take(actionsType.SEND_TO_GROUP_INFO);
      const { group_id } = action;
      const response = yield call(axios.get, `/api/group/${group_id}`);
      if (response && response.status === 200) {
        yield put(actions.response_group_info(response.data));
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export function* sendToJoinGroup() {
  while (true) {
    try {
      const action = yield take(actionsType.SEND_TO_JOIN_GROUP);
      const { room_id, username, owner } = action;
      const response = yield call(axios.post, "/api/message", {
        room_id,
        messageType: totalGrouprMsg.JOIN_GROUP,
        from: username,
        to: owner,
      });
      if (response && response.status === 200) {
        yield put(rootActions.set_notification(0, "发送成功"));
      }
    } catch (error) {
      console.error(error);
    }
  }
}
