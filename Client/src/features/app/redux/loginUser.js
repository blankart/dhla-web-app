// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import { APP_LOGIN_USER, APP_GET_ERRORS } from './constants';
import * as actions from './actions';
import setAuthToken from '../../../common/setAuthToken';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { message } from 'antd';

export const loginUser = userData => dispatch => {
  dispatch(actions.setLoading(true));
  axios
    .post('api/users/login', userData)
    .then(res => {
      dispatch(actions.setLoading(false));
      const { token } = res.data;
      localStorage.setItem('jwtToken', token);
      setAuthToken(token);
      const decoded = jwt_decode(token);
      dispatch(actions.setCurrentUser(decoded));
      dispatch(actions.getCurrentProfile());
    })
    .catch(err => {
      dispatch(actions.setLoading(false));
      dispatch(actions.getErrors(err.response.data));
      if (err.response.data.isActive) {
        message.error(err.response.data.isActive);
      } else {
        message.error(err.response.data.msg);
      }
    });
  return {
    type: APP_LOGIN_USER,
  };
};

export function reducer(state, action) {
  switch (action.type) {
    case APP_LOGIN_USER:
      return {
        ...state,
      };

    default:
      return state;
  }
}
