import { combineReducers } from "redux";
import { IntlReducer as Intl, IntlProvider } from "react-redux-multilingual";

// Import custom components
import accountReducer from "./account";
import settingsReducer from "./settings";
import mediaReducer from './media';


const rootReducer = combineReducers({
  account: accountReducer,
  settings: settingsReducer,
  media: mediaReducer,
  //filters: filtersReducer,
  Intl,
});

export default rootReducer;
