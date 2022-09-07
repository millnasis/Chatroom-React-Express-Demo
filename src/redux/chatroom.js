function handleGroupArray(arr) {
  const map = new Map();
  for (let i = 0; i < arr.length; i++) {
    if (!map.has(arr[i].sort)) {
      map.set(arr[i].sort, [arr[i]]);
    } else {
      map.get(arr[i].sort).push(arr[i]);
    }
  }
  const ret = [];
  map.forEach((value, key) => {
    ret.push({
      sort_name: key,
      arr: value,
    });
  });
  return ret;
}

// 初始状态
const initialState = {
  friendArray: [],
  groupArray: [],
  initial: true,
  talkWindow: {
    show: false,
    private: null,
    target: {
      sort: null,
      room_id: null,
    },
  },
};

export const actionsType = {
  SEND_TO_GET_GROUP_ARRAY: "SEND_TO_GET_GROUP_ARRAY",
  RESPONSE_GROUP_ARRAY: "RESPONSE_GROUP_ARRAY",
  OPEN_TALK_WINDOW: "OPEN_TALK_WINDOW",
  CLOSE_TALK_WINDOW: "CLOSE_TALK_WINDOW",
  SOCKET_ON_TIPS: "SOCKET_ON_TIPS",
  SOCKET_ON_MESSAGE: "SOCKET_ON_MESSAGE",
  SOCKET_ON_DELETE: "SOCKET_ON_DELETE",
  SOCKET_ON_UPDATE: "SOCKET_ON_UPDATE",
};

// 根据上面定义的action类型制作成的action生成器，同时把传入的参数一同加到action中
export const actions = {
  get_group() {
    return {
      type: actionsType.SEND_TO_GET_GROUP_ARRAY,
    };
  },
  response_group(data) {
    return {
      type: actionsType.RESPONSE_GROUP_ARRAY,
      data,
    };
  },
  socket_tips(privateSign, sort, name, data) {
    return {
      type: actionsType.SOCKET_ON_TIPS,
      sort,
      data,
      privateSign,
      name,
    };
  },
  socket_message(privateSign, sort, name, data) {
    return {
      type: actionsType.SOCKET_ON_MESSAGE,
      sort,
      data,
      privateSign,
      name,
    };
  },
  socket_delete(privateSign, sort, name, data) {
    return {
      type: actionsType.SOCKET_ON_DELETE,
      sort,
      data,
      privateSign,
      name,
    };
  },
  socket_update(privateSign, sort, name, data) {
    return {
      type: actionsType.SOCKET_ON_UPDATE,
      sort,
      data,
      privateSign,
      name,
    };
  },
  open_window(privateSign, sort, name) {
    return {
      type: actionsType.OPEN_TALK_WINDOW,
      privateSign,
      sort,
      name,
    };
  },
  close_window() {
    return {
      type: actionsType.CLOSE_TALK_WINDOW,
    };
  },
};

// 状态管理器
// 第一个参数是当前状态，如果当前没状态就赋值为初始状态
// 第二个参数是传入的action，通常是由上面action生成器制作而成
export function reducer(state = initialState, action) {
  switch (action.type) {
    case actionsType.RESPONSE_GROUP_ARRAY: {
      return {
        ...state,
        groupArray: handleGroupArray(action.data.groupArray),
        friendArray: handleGroupArray(action.data.friendArray),
        initial: false,
      };
    }
    case actionsType.OPEN_TALK_WINDOW: {
      const { privateSign, name, sort } = action;

      return {
        ...state,
        talkWindow: {
          show: true,
          private: privateSign,
          target: { sort, room_id: name },
        },
      };
    }
    case actionsType.CLOSE_TALK_WINDOW:
      return {
        ...state,
        talkWindow: {
          show: false,
          private: null,
          target: {
            sort: null,
            room_id: null,
          },
        },
      };
    case actionsType.SOCKET_ON_MESSAGE: {
      const { privateSign, sort, name, data } = action;
      console.log(data);
      if (privateSign) {
        return {
          ...state,
          friendArray: state.friendArray.map((v) => {
            if (v.sort_name === sort) {
              return {
                sort_name: v.sort_name,
                arr: v.arr.map((e) => {
                  if (e.room_id === name) {
                    return {
                      ...e,
                      showMSG: [...e.showMSG, data],
                    };
                  }
                  return e;
                }),
              };
            }
            return v;
          }),
        };
      } else {
        return {
          ...state,
          groupArray: state.groupArray.map((v) => {
            if (v.sort_name === sort) {
              return {
                sort_name: v.sort_name,
                arr: v.arr.map((e) => {
                  if (e.room_id === name) {
                    return {
                      ...e,
                      showMSG: [...e.showMSG, data],
                    };
                  }
                  return e;
                }),
              };
            }
            return v;
          }),
        };
      }
    }
    default:
      return state;
  }
}
