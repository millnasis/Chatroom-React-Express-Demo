// 获取副作用函数
import { put, take, call } from "redux-saga/effects";
// 异步封装
import axios from "axios";

// 从reducer中获取actionsType，同时包含返回数据的action生成器也由reducer提供
import { actionsType, actions, totalResult } from "../redux/message.js";
import { actions as rootActions } from "../redux/root.js";

export function* sendToConfirmMSG() {
  while (true) {
    try {
      const action = yield take(actionsType.SEND_TO_CONFIRM_MSG);
      const { result, from, to, messageType } = action;
      const response = yield call(axios.put, "/api/message", {
        result,
        notice: { from, to, messageType },
      });
      if (response && response.status === 200) {
        yield put(rootActions.get_user_info(true, true));
      }
    } catch (error) {
      console.error(error);
    }
  }
}
