// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import { APP_DELETE_STUDENT_SECTION, APP_GET_ERRORS } from './constants';
import * as actions from './actions';
import axios from 'axios';
import { message } from 'antd';

export const deleteStudentSection = data => dispatch => {
  dispatch(actions.setLoading(true));
  axios
    .post('api/registrar/deletestudentsection', data)
    .then(res => {
      dispatch({ type: APP_GET_ERRORS, payload: {} });
      dispatch(actions.setLoading(false));
      dispatch({ type: APP_DELETE_STUDENT_SECTION });
      message.success('Student unenrolled successfully!');
    })
    .catch(err => {
      dispatch({ type: APP_DELETE_STUDENT_SECTION });
      dispatch(actions.setLoading(false));
      dispatch({ type: APP_GET_ERRORS, payload: err.response.data });
      message.error(err.response.data.studentName);
    });
};

export function reducer(state, action) {
  switch (action.type) {
    case APP_DELETE_STUDENT_SECTION:
      return {
        ...state,
      };

    default:
      return state;
  }
}
