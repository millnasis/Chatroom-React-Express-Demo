// 获取副作用函数
import { put, take, call } from "redux-saga/effects";
// 异步封装
import axios from "axios";

// 从reducer中获取actionsType，同时包含返回数据的action生成器也由reducer提供
import { actionsType, actions } from "../redux/root.js";
import {
  actionsType as UIactionsType,
  actions as UIactions,
} from "../redux/login.js";

// 该函数为下面拦截action做封装，仅自用
function* loginSend(username, password) {
  // 发送一个action，让UI显示获取请求的动画
  yield put(UIactions.start_fetch());
  // 异步请求可能会出错，应放在try-catch中
  try {
    // call函数，调用异步请求函数时使用，这里用axios的post方法发送
    return yield call(axios.post, "/api/login", { username, password });
  } catch (error) {
    console.log(error);
    if (error.response.data === "username") {
      yield put({ type: UIactionsType.USER_LOGIN_USERNAME_ERROR });
    } else if (error.response.data === "password") {
      yield put({ type: UIactionsType.USER_LOGIN_PASSWORD_ERROR });
    }
  } finally {
    // 发送一个action，让UI停止显示获取请求的动画
    yield put(UIactions.end_fetch());
  }
}

// 将所有需要监听并拦截action的函数导出
export function* checkLogin() {
  // generator函数都是有需要的时候就调用一次，所以可以直接使用无限循环处理监听
  while (true) {
    // 拦截action
    let loginData = yield take(actionsType.SEND_TO_LOGIN);
    // 调用上面封装好的函数
    let response = yield call(
      loginSend,
      loginData.username,
      loginData.password
    );
    // 处理返回
    if (response && response.status === 200) {
      yield put(actions.response_login(response.data));
    }
  }
}
