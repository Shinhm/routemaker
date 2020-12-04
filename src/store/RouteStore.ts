import { action, ActionType, createReducer } from 'typesafe-actions';
import { produce } from 'immer';
import { IRoute, IRouteRoutes } from '../models/Route';

const ROUTES = 'ROUTES';
const ROUTE = 'ROUTE';

export const setRoutes = (routes: IRoute) => {
  return action(ROUTES, routes);
};

export const setRoute = (route: IRouteRoutes) => {
  return action(ROUTE, route);
};

export const clearRoute = () => {
  return action(ROUTE, null);
};

const actions = { setRoutes, setRoute, clearRoute };
type TAction = ActionType<typeof actions>;

type TInitialStateProps = {
  routes: IRoute | null;
  route: IRouteRoutes | null;
};

const initialState: TInitialStateProps = {
  routes: null,
  route: null,
};

export default createReducer<TInitialStateProps, TAction>(initialState, {
  [ROUTES]: (state, action) =>
    produce(state, (draft) => {
      draft.routes = action.payload;
    }),
  [ROUTE]: (state, action) =>
    produce(state, (draft) => {
      draft.route = action.payload;
    }),
});
