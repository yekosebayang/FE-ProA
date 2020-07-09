import { combineReducers } from "redux";
import userReducer from "./user";
import searchReducer from "./search";
import signReducer from "./sign";


export default combineReducers({
  user: userReducer,
  search: searchReducer,
  sign: signReducer,

});
