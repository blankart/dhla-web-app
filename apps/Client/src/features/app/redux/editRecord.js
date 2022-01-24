// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import { APP_EDIT_RECORD, APP_GET_ERRORS } from './constants';
import * as actions from './actions';
import axios from 'axios';
import { message } from 'antd';

export const editRecord = (data, position) => dispatch => {
  dispatch(actions.setLoading(true));
  axios
    .post(`api/${position.toLowerCase()}/editrecord`, data)
    .then(res => {
      message.success(res.data.msg);
      dispatch(actions.setLoading(false));
      dispatch({ type: APP_GET_ERRORS, payload: {} });
      dispatch({ type: APP_EDIT_RECORD });
    })
    .catch(err => {
      dispatch({ type: APP_GET_ERRORS, payload: err.response.data });
      dispatch(actions.setLoading(false));
      message.error(err.response.data.msg);
    });
};
export function reducer(state, action) {
  switch (action.type) {
    case APP_EDIT_RECORD:
      return {
        ...state,
      };

    default:
      return state;
  }
}
