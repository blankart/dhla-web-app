// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import { APP_ACTIVATE_ACCOUNT, APP_GET_ERRORS } from './constants';
import axios from 'axios';
import * as actions from './actions';
import { message } from 'antd';

export const activateAccount = userData => dispatch => {
  axios
    .post('api/admin/activate', userData)
    .then(res => {
      message.success('The account has been activated successfully!');
      dispatch({ type: APP_ACTIVATE_ACCOUNT });
    })
    .catch(err => {
      dispatch({ type: APP_GET_ERRORS, payload: err.response.data });
    });
};

export function reducer(state, action) {
  switch (action.type) {
    case APP_ACTIVATE_ACCOUNT:
      return {
        ...state,
      };

    default:
      return state;
  }
}
