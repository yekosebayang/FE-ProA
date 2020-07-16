import userTypes from "../types/user";

const { ON_LOGIN_FAIL, ON_LOGIN_SUCCESS, ON_LOGOUT_SUCCESS } = userTypes;

const init_state = {
  id: 0,
  username: "",
  useremail: "",
  address: {},
  userrole: "",
  userrealname: "",
  userphone: "",
  errMsg: "",
  cookieChecked: false,
  cartItems: 0,
  verified: ""
};

export default (state = init_state, action) => {
  switch (action.type) {
    case ON_LOGIN_SUCCESS:
      const { username, useremail, userrole, id, verified, userrealname, userphone } = action.payload;
      return {
        ...state,
        id,
        username,
        useremail,
        userrole,
        userrealname,
        userphone,
        verified,
        cookieChecked: true,
      };
    case ON_LOGIN_FAIL:
      return { ...state, errMsg: action.payload, cookieChecked: true };
    case "ON_REGISTER_FAIL":
      return { ...state, errMsg: action.payload, cookieChecked: true };
    case ON_LOGOUT_SUCCESS:
      return { ...init_state, cookieChecked: true };
    case "COOKIE_CHECK":
      return { ...state,  id: 0, cookieChecked: true };
    case "FILL_CART":
      return { ...state, cartItems: action.payload };
    case "RESET_ERRMSG":
      return { ...state, errMsg: action.payload }; 
    default:
      return { ...state };
  }
};
