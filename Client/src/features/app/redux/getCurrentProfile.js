// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import { APP_GET_CURRENT_PROFILE, APP_GET_ERRORS } from './constants';
import axios from 'axios';

export const getCurrentProfile = () => dispatch => {
  axios
    .get('api/users/profile')
    .then(res => {
      dispatch({ type: APP_GET_CURRENT_PROFILE, payload: res.data });
    })
    .catch(err => {
      dispatch({
        type: APP_GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export function reducer(state, action) {
  switch (action.type) {
    case APP_GET_CURRENT_PROFILE:
      return {
        ...state,
        profile: action.payload,
      };

    default:
      return state;
  }
}
