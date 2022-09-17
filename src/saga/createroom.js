// 获取副作用函数
import { put, take, call } from "redux-saga/effects";
// 异步封装
import axios from "axios";

// 从reducer中获取actionsType，同时包含返回数据的action生成器也由reducer提供
import { actionsType, actions } from "../redux/createroom.js";
import { actions as rootActions } from "../redux/root.js";

export function* sendToCreateRoom() {
  while (true) {
    try {
      const action = yield take(actionsType.SEND_TO_CREATE_ROOM);
      yield put(actions.loading());
      const { groupName, owner, inviteList, avatar, words } = action;
      const response = yield call(axios.post, "/api/group", {
        groupName,
        owner,
        inviteList,
        avatar,
        words,
      });
      if (response && response.status === 200) {
        yield put(rootActions.set_notification(0, "创建成功"));
        yield put(rootActions.get_user_info(true, true));
        yield put(actions.response());
      }
    } catch (error) {
      console.error(error);
    }
  }
}
