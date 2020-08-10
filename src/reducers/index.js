import { combineReducers } from 'redux';
import { IntlReducer as Intl, IntlProvider } from 'react-redux-multilingual'

// Import custom components
import filtersReducer from './filters';
import accountReducer from './account';

const rootReducer = combineReducers({
    account: accountReducer,
    filters: filtersReducer,
    Intl
});

export default rootReducer;