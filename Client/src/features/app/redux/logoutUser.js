// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import { APP_LOGOUT_USER } from './constants';
import * as actions from './actions';
import setAuthToken from '../../../common/setAuthToken';

export function logoutUser() {
  actions.setLoading(true);
  localStorage.removeItem('jwtToken');
  setAuthToken(false);
  actions.setLoading(false);
  return {
    type: APP_LOGOUT_USER,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case APP_LOGOUT_USER:
      return {
        ...state,
        auth: {
          isAuthenticated: false,
          user: {},
        },
        profile: {},
      };

    default:
      return state;
  }
}
