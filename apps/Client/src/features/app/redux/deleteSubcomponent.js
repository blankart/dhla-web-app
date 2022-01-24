// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import { APP_DELETE_SUBCOMPONENT, APP_GET_ERRORS } from './constants';
import * as actions from './actions';
import axios from 'axios';
import { message } from 'antd';

export const deleteSubcomponent = (data, position) => dispatch => {
  dispatch(actions.setLoading(true));
  if (position == 'Teacher') {
    axios
      .post('api/teacher/deletesubcomp', data)
      .then(res => {
        message.success(res.data.msg);
        dispatch(actions.setLoading(false));
        dispatch({ type: APP_GET_ERRORS, payload: {} });
      })
      .catch(err => {
        dispatch({ type: APP_GET_ERRORS, payload: err.response.data });
        dispatch(actions.setLoading(false));
        message.error(err.response.data.msg);
      });
  } else {
    axios
      .post('api/registrar/deletesubcomp', data)
      .then(res => {
        message.success(res.data.msg);
        dispatch(actions.setLoading(false));
        dispatch({ type: APP_GET_ERRORS, payload: {} });
      })
      .catch(err => {
        dispatch({ type: APP_GET_ERRORS, payload: err.response.data });
        dispatch(actions.setLoading(false));
        message.error(err.response.data.msg);
      });
  }
};

export function reducer(state, action) {
  switch (action.type) {
    case APP_DELETE_SUBCOMPONENT:
      return {
        ...state,
      };

    default:
      return state;
  }
}
