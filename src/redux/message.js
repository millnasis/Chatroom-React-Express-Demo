// 初始状态
const initialState = {
  showUserMSG: [],
  showGroupMSG: [],
};

export const totalResult = {
  CONFIRM: "CONFIRM",
  CONFIRM_BACK: "CONFIRM_BACK",
  DENY: "DENY",
  DENY_BACK: "DENY_BACK",
};

export const actionsType = {
  RESPONSE_USER_MESSAGE_ARRAY: "RESPONSE_USER_MESSAGE_ARRAY",
  SOCKET_ON_MSG: "SOCKET_ON_MSG",
  SEND_TO_CONFIRM_MSG: "SEND_TO_CONFIRM_MSG",
};

// 根据上面定义的action类型制作成的action生成器，同时把传入的参数一同加到action中
export const actions = {
  response_user_msg(data) {
    return {
      type: actionsType.RESPONSE_USER_MESSAGE_ARRAY,
      data,
    };
  },
  socket_msg(data) {
    return {
      type: actionsType.SOCKET_ON_MSG,
      data,
    };
  },
  confirm_msg(result, from, to, messageType) {
    return {
      type: actionsType.SEND_TO_CONFIRM_MSG,
      result,
      from,
      to,
      messageType,
    };
  },
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case actionsType.RESPONSE_USER_MESSAGE_ARRAY: {
      const userarr = [];
      const grouparr = [];
      action.data.forEach((e) => {
        if (e.private) {
          userarr.push(e);
        } else {
          grouparr.push(e);
        }
      });
      return {
        ...state,
        showUserMSG: userarr.reverse(),
        showGroupMSG: grouparr.reverse(),
      };
    }
    case actionsType.SOCKET_ON_MSG: {
      return {
        ...state,
        showUserMSG: [action.data, ...state.showUserMSG],
      };
    }
    default:
      return state;
  }
}
