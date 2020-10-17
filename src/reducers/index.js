import { combineReducers } from "redux";

// Import custom components
import accountReducer from "./account";
import settingsReducer from "./settings";
import mediaReducer from './media';


const rootReducer = combineReducers({
  account: accountReducer,
  settings: settingsReducer,
  media: mediaReducer,
  //filters: filtersReducer,
});

export default rootReducer;
