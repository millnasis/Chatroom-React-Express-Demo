// 初始状态
const initialState = {
  targetInfo: {},
};

export const actionsType = {
  SEND_TO_GET_TARGET_INFO: "SEND_TO_GET_TARGET_INFO",
  RESPONSE_TARGET_INFO: "RESPONSE_TARGET_INFO",
};

// 根据上面定义的action类型制作成的action生成器，同时把传入的参数一同加到action中
export const actions = {
  get_info(username) {
    return {
      type: actionsType.SEND_TO_GET_TARGET_INFO,
      username,
    };
  },
  response_info(data) {
    return {
      type: actionsType.RESPONSE_TARGET_INFO,
      data,
    };
  },
};

// 状态管理器
// 第一个参数是当前状态，如果当前没状态就赋值为初始状态
// 第二个参数是传入的action，通常是由上面action生成器制作而成
export function reducer(state = initialState, action) {
  switch (action.type) {
    case actionsType.RESPONSE_TARGET_INFO:
      return {
        ...state,
        targetInfo: action.data,
      };
    default:
      return state;
  }
}