const init_state = {
    category: [],
    product: [],
  };
  
  export default (state = init_state, action) => {
    switch (action.type) {
      case "GET_CATEGORY":
        return { ...state, category: action.payload };
        case "GET_PRODUCT":
          return { ...state, product: action.payload };  
      default:
        return { ...state };
    }
  };
  