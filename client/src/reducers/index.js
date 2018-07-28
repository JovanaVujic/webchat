import { combineReducers } from "redux";
import authReducer from "./authReducer";
import profileReducer from "./profileReducer";
import errorReducer from "./errorReducer";
import messageReducer from "./messageReducer";

export default combineReducers({
  auth: authReducer,
  profile: profileReducer,
  message: messageReducer,
  errors: errorReducer
});
