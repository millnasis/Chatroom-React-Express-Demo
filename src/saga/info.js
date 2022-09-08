// 获取副作用函数
import { put, take, call } from "redux-saga/effects";
// 异步封装
import axios from "axios";

// 从reducer中获取actionsType，同时包含返回数据的action生成器也由reducer提供
import { actionsType, actions } from "../redux/info.js";

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
