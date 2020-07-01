// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import { APP_GET_ACCOUNT_LIST, APP_GET_ERRORS } from './constants';
import * as actions from './actions';
import axios from 'axios';

export const getAccountList = request => dispatch => {
  axios
    .post('api/admin/getaccounts', request)
    .then(res => {
      dispatch({ type: APP_GET_ACCOUNT_LIST, payload: res.data });
    })
    .catch(err => {
      dispatch({ type: APP_GET_ERRORS, payload: err.response.data });
    });
};

export function reducer(state, action) {
  switch (action.type) {
    case APP_GET_ACCOUNT_LIST:
      return {
        ...state,
        accounts: action.payload,
      };

    default:
      return state;
  }
}
