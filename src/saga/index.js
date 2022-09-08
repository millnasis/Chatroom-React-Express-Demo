// saga入口文件
import { fork } from "redux-saga/effects";
import * as login from "./login.js";
import * as user from "./user.js";
import * as info from "./info.js";
import * as chatroom from "./chatroom.js";
import * as search from "./search.js";

// 在根saga上，启用所有的监听函数
export default function* rootSaga() {
  yield fork(login.checkLogin);
  yield fork(user.getUserInfo);
  yield fork(user.sendLogout);
  yield fork(info.getTargetInfo);
  yield fork(chatroom.sendToGetGroup);
  yield fork(chatroom.sendToGetRecord);
  yield fork(search.sendToSearchUser);
  yield fork(search.sendToSearchGroup);
}
