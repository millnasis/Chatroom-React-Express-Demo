import { combineReducers } from "redux";
// 导入其他reducer
import { reducer as loginReducer } from "./login.js";
import { reducer as infoReducer } from "./info.js";
import { reducer as chatroomReducer } from "./chatroom.js";
import { reducer as searchReducer } from "./search.js";

// 初始状态
const initialState = {
  userInfo: {},
  login: false,
};

export const actionsType = {
  SEND_TO_GET_USER_INFO: "SEND_TO_GET_USER_INFO",
  RESPONSE_USER_INFO: "RESPONSE_USER_INFO",
  SEND_TO_LOGIN: "SEND_TO_LOGIN",
  RESPONSE_LOGIN: "RESPONSE_LOGIN",
  SEND_TO_REGISTER: "SEND_TO_REGISTER",
  RESPONSE_REGISTER: "RESPONSE_REGISTER",
  SEND_TO_LOGOUT: "SEND_TO_LOGOUT",
  RESET_USER_INFO: "RESET_USER_INFO",
};

// 根据上面定义的action类型制作成的action生成器，同时把传入的参数一同加到action中
export const actions = {
  get_user_info(group = false) {
    return {
      type: actionsType.SEND_TO_GET_USER_INFO,
      group,
    };
  },
  response_user_info(data) {
    return {
      type: actionsType.RESPONSE_USER_INFO,
      data,
    };
  },
  send_login(username, password) {
    return {
      type: actionsType.SEND_TO_LOGIN,
      username,
      password,
    };
  },
  response_login(data) {
    return {
      type: actionsType.RESPONSE_LOGIN,
      data,
    };
  },
  send_register(username, password) {
    return {
      type: actionsType.SEND_TO_REGISTER,
      username,
      password,
    };
  },
  response_register(data) {
    return {
      type: actionsType.RESPONSE_REGISTER,
      data,
    };
  },
  send_logout() {
    return {
      type: actionsType.SEND_TO_LOGOUT,
    };
  },
  reset_user_info() {
    return {
      type: actionsType.RESET_USER_INFO,
    };
  },
};

// 状态管理器
// 第一个参数是当前状态，如果当前没状态就赋值为初始状态
// 第二个参数是传入的action，通常是由上面action生成器制作而成
export function reducer(state = initialState, action) {
  switch (action.type) {
    case actionsType.RESET_USER_INFO:
      return {
        ...state,
        login: false,
        userInfo: {},
      };
    case actionsType.RESPONSE_USER_INFO:
      return {
        ...state,
        login: true,
        userInfo: action.data,
      };
    case actionsType.RESPONSE_LOGIN:
      return {
        ...state,
        login: true,
        userInfo: action.data,
      };
    case actionsType.RESPONSE_REGISTER:
      return {
        ...state,
        login: true,
        userInfo: action.data,
      };
    default:
      return state;
  }
}

// 这一步仅rootReducer需要做，将其他reducer联合起来，生成的对象导出，供store使用
export default combineReducers({
  global: reducer,
  login: loginReducer,
  info: infoReducer,
  chatroom: chatroomReducer,
  search: searchReducer,
});
