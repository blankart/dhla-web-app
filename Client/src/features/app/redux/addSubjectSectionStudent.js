// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import { APP_ADD_SUBJECT_SECTION_STUDENT, APP_GET_ERRORS } from './constants';
import * as actions from './actions';
import axios from 'axios';
import { message } from 'antd';

export const addSubjectSectionStudent = data => dispatch => {
  dispatch(actions.setLoading(true));
  dispatch({ type: APP_ADD_SUBJECT_SECTION_STUDENT });
  axios
    .post('api/registrar/addsubsectstud', data)
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
    case APP_ADD_SUBJECT_SECTION_STUDENT:
      return {
        ...state,
      };

    default:
      return state;
  }
}
