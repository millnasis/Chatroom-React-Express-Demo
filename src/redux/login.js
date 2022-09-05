const UIInitialState = {
  isLoginModalFetching: false,
  isLoginError: null,
};

export const actionsType = {
  USER_LOGIN_USERNAME_ERROR: "USER_LOGIN_USERNAME_ERROR",
  USER_LOGIN_PASSWORD_ERROR: "USER_LOGIN_PASSWORD_ERROR",
  USER_REGISTER_USERNAME_EXIST_ERROR: "USER_REGISTER_USERNAME_EXIST_ERROR",
  USER_LOGIN_RESET_ERROR: "USER_LOGIN_RESET_ERROR",
  LOGIN_FETCH_START: "LOGIN_FETCH_START",
  LOGIN_FETCH_END: "LOGIN_FETCH_END",
  
};

export const actions = {
  start_fetch() {
    return {
      type: actionsType.LOGIN_FETCH_START,
    };
  },
  end_fetch() {
    return {
      type: actionsType.LOGIN_FETCH_END,
    };
  },
  reset_login_error() {
    return {
      type: actionsType.USER_LOGIN_RESET_ERROR,
    };
  },
};

export function reducer(UIstate = UIInitialState, action) {
  switch (action.type) {
    case actionsType.LOGIN_FETCH_START:
      return {
        ...UIstate,
        isLoginModalFetching: true,
      };
    case actionsType.LOGIN_FETCH_END:
      return {
        ...UIstate,
        isLoginModalFetching: false,
      };
    case actionsType.USER_LOGIN_USERNAME_ERROR:
      return {
        ...UIstate,
        isLoginError: "username",
      };
    case actionsType.USER_LOGIN_PASSWORD_ERROR:
      return {
        ...UIstate,
        isLoginError: "password",
      };
    case actionsType.USER_LOGIN_RESET_ERROR:
      return {
        ...UIstate,
        isLoginError: null,
      };
    case actionsType.USER_REGISTER_USERNAME_EXIST_ERROR:
      return {
        ...UIstate,
        isLoginError: "userexist",
      };
    default:
      return UIstate;
  }
}
