// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import { APP_CHANGE_PASSWORD, APP_GET_ERRORS } from './constants';
import * as actions from './actions';
import axios from 'axios';
import { message } from 'antd';

export const changePassword = userData => dispatch => {
  dispatch(actions.setLoading(true));
  axios
    .post('api/users/changepassword', userData)
    .then(res => {
      message.success('You have successfully updated your password!');
      dispatch(actions.setLoading(false));
      dispatch({ type: APP_CHANGE_PASSWORD });
      dispatch({ type: APP_GET_ERRORS, payload: {} });
    })
    .catch(err => {
      dispatch(actions.setLoading(false));
      dispatch({ type: APP_GET_ERRORS, payload: err.response.data });
    });
  axios;
};

export function reducer(state, action) {
  switch (action.type) {
    case APP_CHANGE_PASSWORD:
      return {
        ...state,
      };

    default:
      return state;
  }
}
