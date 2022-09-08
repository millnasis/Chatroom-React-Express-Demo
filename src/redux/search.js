// 初始状态
const initialState = {
  showUserSearchArr: [],
  showGroupSearchArr: [],
};

export const actionsType = {
  SEND_TO_GET_USER_SEARCH_ARRAY: "SEND_TO_GET_USER_SEARCH_ARRAY",
  RESPONSE_USER_SEARCH_ARRAY: "RESPONSE_USER_SEARCH_ARRAY",
  SEND_TO_GET_GROUP_SEARCH_ARRAY: "SEND_TO_GET_GROUP_SEARCH_ARRAY",
  RESPONSE_GROUP_SEARCH_ARRAY: "RESPONSE_GROUP_SEARCH_ARRAY",
};

// 根据上面定义的action类型制作成的action生成器，同时把传入的参数一同加到action中
export const actions = {
  get_user_search(keyword, skip = 0, limit = 20) {
    return {
      type: actionsType.SEND_TO_GET_USER_SEARCH_ARRAY,
      keyword,
      skip,
      limit,
    };
  },
  response_user_search(data) {
    return {
      type: actionsType.RESPONSE_USER_SEARCH_ARRAY,
      data,
    };
  },
  get_group_search(keyword, skip = 0, limit = 20) {
    return {
      type: actionsType.SEND_TO_GET_GROUP_SEARCH_ARRAY,
      keyword,
      skip,
      limit,
    };
  },
  response_group_search(data) {
    return {
      type: actionsType.RESPONSE_GROUP_SEARCH_ARRAY,
      data,
    };
  },
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case actionsType.RESPONSE_USER_SEARCH_ARRAY:
      return {
        ...state,
        showUserSearchArr: action.data,
      };
    case actionsType.RESPONSE_GROUP_SEARCH_ARRAY:
      return {
        ...state,
        showGroupSearchArr: action.data,
      };
    default:
      return state;
  }
}
