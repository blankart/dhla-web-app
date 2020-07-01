// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import { APP_GET_CURRENT_PROFILE, APP_GET_ERRORS, APP_SET_LOADING } from './constants';
import axios from 'axios';

export const getCurrentProfile = () => dispatch => {
  dispatch({ type: APP_SET_LOADING, payload: true });
  axios
    .get('api/users/profile')
    .then(res => {
      dispatch({ type: APP_GET_CURRENT_PROFILE, payload: res.data });
      dispatch({ type: APP_SET_LOADING, payload: false });
    })
    .catch(err => {
      dispatch({
        type: APP_GET_ERRORS,
        payload: err.response.data,
      });
      dispatch({ type: APP_SET_LOADING, payload: false });
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
