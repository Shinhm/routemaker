import { combineReducers } from 'redux';
import user from './UserStore';
import route from './RouteStore';

const rootReducer = combineReducers({
  user,
  route,
});

export default rootReducer;

export type IRootState = ReturnType<typeof rootReducer>;
