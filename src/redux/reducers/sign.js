const init_state = {
    signValue: "false",
  };
  
  export default (state = init_state, action) => {
    switch (action.type) {
      case "SIGN_CLICKED":
        return { ...state, signValue: action.payload };
      default:
        return { ...state };
    }
  };
  