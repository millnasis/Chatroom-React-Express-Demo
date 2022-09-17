// 初始状态
const initialState = {
  loading: false,
  response: false,
};

export const actionsType = {
  SEND_TO_CREATE_ROOM: "SEND_TO_CREATE_ROOM",
  LOADING: "LOADING",
  RESPONSE: "RESPONSE",
  RESET: "RESET",
};

// 根据上面定义的action类型制作成的action生成器，同时把传入的参数一同加到action中
export const actions = {
  create_room(groupName, owner, inviteList, avatar, words) {
    return {
      type: actionsType.SEND_TO_CREATE_ROOM,
      groupName,
      owner,
      inviteList,
      avatar,
      words,
    };
  },
  loading() {
    return {
      type: actionsType.LOADING,
    };
  },
  response() {
    return {
      type: actionsType.RESPONSE,
    };
  },
  reset() {
    return {
      type: actionsType.RESET,
    };
  },
};

// 状态管理器
// 第一个参数是当前状态，如果当前没状态就赋值为初始状态
// 第二个参数是传入的action，通常是由上面action生成器制作而成
export function reducer(state = initialState, action) {
  switch (action.type) {
    case actionsType.LOADING:
      return {
        ...state,
        loading: true,
      };
    case actionsType.RESPONSE:
      return {
        ...state,
        loading: false,
        response: true,
      };
    case actionsType.RESET:
      return {
        ...state,
        loading: false,
        response: false,
      };
    default:
      return state;
  }
}
