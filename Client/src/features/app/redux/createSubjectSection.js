// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import { APP_CREATE_SUBJECT_SECTION, APP_GET_ERRORS } from './constants';
import * as actions from './actions';
import axios from 'axios';
import { message } from 'antd';

export const createSubjectSection = data => dispatch => {
  dispatch(actions.setLoading(true));
  dispatch({ type: APP_CREATE_SUBJECT_SECTION });
  axios
    .post('api/registrar/createsubjectsection', data)
    .then(res => {
      dispatch(actions.setLoading(false));
      message.success('Subject load added successfully!');
      dispatch({ type: APP_GET_ERRORS, payload: {} });
    })
    .catch(err => {
      dispatch(actions.setLoading(false));
      dispatch({ type: APP_GET_ERRORS, payload: err.response.data });
      message.error(err.response.data.msg);
    });
};

export function reducer(state, action) {
  switch (action.type) {
    case APP_CREATE_SUBJECT_SECTION:
      return {
        ...state,
      };

    default:
      return state;
  }
}
