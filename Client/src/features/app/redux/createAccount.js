// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import { APP_CREATE_ACCOUNT, APP_GET_ERRORS } from './constants';
import * as actions from './actions';
import axios from 'axios';
import { message } from 'antd';
export const createAccount = userData => dispatch => {
  dispatch(actions.setLoading(true));
  axios
    .post('api/admin/createaccount', userData)
    .then(res => {
      dispatch(actions.setLoading(false));
      message.success(
        'Account created successfully! Default password is lowercase first name + last name + 123.',
      );
    })
    .catch(err => {
      dispatch(actions.setLoading(false));
      dispatch({
        type: APP_GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export function reducer(state, action) {
  switch (action.type) {
    case APP_CREATE_ACCOUNT:
      return {
        ...state,
      };

    default:
      return state;
  }
}
