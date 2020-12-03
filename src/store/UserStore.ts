import { action, ActionType, createReducer } from 'typesafe-actions';
import { produce } from 'immer';
import { IKakaoAuth, IUser } from '../models/User';

const USER_TYPE = 'USER_TYPE';
const USER_ROUTES_TYPE = 'USER_ROUTES_TYPE';

export const setKakaoAuth = (kakaoAuth: IKakaoAuth) => {
  return action(USER_TYPE, kakaoAuth);
};

export const setUserRoute = (user: IUser) => {
  return action(USER_ROUTES_TYPE, user);
};

const actions = { setKakaoAuth, setUserRoute };
type TAction = ActionType<typeof actions>;

type TInitialStateProps = {
  kakaoAuth: IKakaoAuth | null;
  user: IUser | null;
};

const initialState: TInitialStateProps = {
  kakaoAuth: null,
  user: null,
};

export default createReducer<TInitialStateProps, TAction>(initialState, {
  [USER_TYPE]: (state, action) =>
    produce(state, (draft) => {
      draft.kakaoAuth = action.payload;
    }),
  [USER_ROUTES_TYPE]: (state, action) =>
    produce(state, (draft) => {
      draft.user = action.payload;
    }),
});
