// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import { APP_EDIT_SECTION, APP_GET_ERRORS } from './constants';
import * as actions from './actions';
import axios from 'axios';
import { message } from 'antd';

export const editSection = data => dispatch => {
  dispatch(actions.setLoading(true));
  axios
    .post('api/registrar/editsection', data)
    .then(res => {
      message.success('You have successfully edited the section!');
      dispatch(actions.setLoading(false));
      dispatch({ type: APP_GET_ERRORS, payload: {} });
    })
    .catch(err => {
      dispatch({ type: APP_GET_ERRORS, payload: err.response.data });
      dispatch(actions.setLoading(false));
    });
};

export function reducer(state, action) {
  switch (action.type) {
    case APP_EDIT_SECTION:
      return {
        ...state,
      };

    default:
      return state;
  }
}
