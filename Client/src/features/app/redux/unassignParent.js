// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import { APP_UNASSIGN_PARENT, APP_GET_ERRORS } from './constants';
import * as actions from './actions';
import { message } from 'antd';
import axios from 'axios';

export const unassignParent = data => dispatch => {
  dispatch({ type: APP_UNASSIGN_PARENT });
  dispatch(actions.setLoading(true));
  axios
    .post('api/admin/unassignparent', data)
    .then(res => {
      message.success(res.data.msg);
      dispatch(actions.setLoading(false));
    })
    .catch(err => {
      message.error(err.response.data.msg);
      dispatch(actions.setLoading(false));
      dispatch({ type: APP_GET_ERRORS, payload: err.response.data });
    });
};

export function reducer(state, action) {
  switch (action.type) {
    case APP_UNASSIGN_PARENT:
      return {
        ...state,
      };

    default:
      return state;
  }
}
