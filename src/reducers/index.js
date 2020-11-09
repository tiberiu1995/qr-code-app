import { combineReducers } from "redux";

// Import custom components
import accountReducer from "./account";
import settingsReducer from "./settings";
import mediaReducer from './media';
import cartReducer from './cart';


const rootReducer = combineReducers({
  account: accountReducer,
  settings: settingsReducer,
  media: mediaReducer,
  cart: cartReducer
  //filters: filtersReducer,
});

export default rootReducer;
