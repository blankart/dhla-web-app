// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import { APP_GET_ERRORS } from './constants';

export const getErrors = data => dispatch => {
  dispatch({ type: APP_GET_ERRORS, payload: data });
};

export function reducer(state, action) {
  switch (action.type) {
    case APP_GET_ERRORS:
      return {
        ...state,
        errors: action.payload,
      };

    default:
      return state;
  }
}
