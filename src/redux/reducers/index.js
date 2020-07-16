import { combineReducers } from "redux";
import userReducer from "./user";
import searchReducer from "./search";
import signReducer from "./sign";
import prdcReducer from "./prdc";

export default combineReducers({
  user: userReducer,
  search: searchReducer,
  sign: signReducer,
  prdc: prdcReducer,
});
