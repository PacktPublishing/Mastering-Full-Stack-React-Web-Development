import { combineReducers }  from 'redux';
import { routeReducer }  from 'redux-simple-router';

import article from './article';

export default combineReducers({
  routing: routeReducer,
  article
});