// 获取副作用函数
import { put, take, call } from "redux-saga/effects";
// 异步封装
import axios from "axios";

// 从reducer中获取actionsType，同时包含返回数据的action生成器也由reducer提供
import { actionsType, actions } from "../redux/search.js";

export function* sendToSearchUser() {
  while (true) {
    try {
      const action = yield take(actionsType.SEND_TO_GET_USER_SEARCH_ARRAY);
      const { keyword, skip, limit } = action;
      const response = yield call(axios.get, "/api/search/single", {
        params: { word: keyword, skip, limit },
      });
      if (response && response.status === 200) {
        yield put(actions.response_user_search(response.data));
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export function* sendToSearchGroup() {
  while (true) {
    try {
      const action = yield take(actionsType.SEND_TO_GET_GROUP_SEARCH_ARRAY);
      const { keyword, skip, limit } = action;
      const response = yield call(axios.get, "/api/search/group", {
        params: { word: keyword, skip, limit },
      });
      if (response && response.status === 200) {
        yield put(actions.response_group_search(response.data));
      }
    } catch (error) {
      console.error(error);
    }
  }
}
