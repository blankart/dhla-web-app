// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import {
  APP_SET_LOADING,
} from './constants';

export function setLoading(input) {
  return {
    type: APP_SET_LOADING,
    payload: input
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case APP_SET_LOADING:
      return {
        ...state,
        showLoading: action.payload
      };

    default:
      return state;
  }
}
