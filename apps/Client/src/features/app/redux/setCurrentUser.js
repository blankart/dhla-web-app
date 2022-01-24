// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import { APP_SET_CURRENT_USER } from './constants';
import * as actions from './actions';

export function setCurrentUser(payload) {
  actions.getCurrentProfile();
  return {
    type: APP_SET_CURRENT_USER,
    payload,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case APP_SET_CURRENT_USER:
      return {
        ...state,
        auth: {
          isAuthenticated: true,
          user: action.payload,
        },
      };

    default:
      return state;
  }
}
