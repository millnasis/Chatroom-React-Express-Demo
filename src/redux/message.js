// 初始状态
const initialState = {
  showUserMSG: [],
  showGroupMSG: [],
};

export const actionsType = {
  SEND_TO_GET_USER_MESSAGE_ARRAY: "SEND_TO_GET_USER_MESSAGE_ARRAY",
  RESPONSE_USER_MESSAGE_ARRAY: "RESPONSE_USER_MESSAGE_ARRAY",
  SEND_TO_GET_GROUP_MESSAGE_ARRAY: "SEND_TO_GET_GROUP_MESSAGE_ARRAY",
  RESPONSE_GROUP_MESSAGE_ARRAY: "RESPONSE_GROUP_MESSAGE_ARRAY",
};

// 根据上面定义的action类型制作成的action生成器，同时把传入的参数一同加到action中
export const actions = {
  get_user_msg(keyword, skip = 0, limit = 20) {
    return {
      type: actionsType.SEND_TO_GET_USER_MESSAGE_ARRAY,
      keyword,
      skip,
      limit,
    };
  },
  response_user_msg(data) {
    return {
      type: actionsType.RESPONSE_USER_MESSAGE_ARRAY,
      data,
    };
  },
  get_group_msg(keyword, skip = 0, limit = 20) {
    return {
      type: actionsType.SEND_TO_GET_GROUP_MESSAGE_ARRAY,
      keyword,
      skip,
      limit,
    };
  },
  response_group_msg(data) {
    return {
      type: actionsType.RESPONSE_GROUP_MESSAGE_ARRAY,
      data,
    };
  },
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case actionsType.RESPONSE_USER_MESSAGE_ARRAY:
      return {
        ...state,
        showUserMSG: action.data,
      };
    case actionsType.RESPONSE_GROUP_MESSAGE_ARRAY:
      return {
        ...state,
        showGroupMSG: action.data,
      };
    default:
      return state;
  }
}
