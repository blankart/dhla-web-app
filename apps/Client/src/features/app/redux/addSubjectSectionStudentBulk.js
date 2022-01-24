// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import { APP_ADD_SUBJECT_SECTION_STUDENT_BULK, APP_GET_ERRORS } from './constants';
import * as actions from './actions';
import axios from 'axios';
import { message } from 'antd';

export const addSubjectSectionStudentBulk = data => async dispatch => {
  dispatch(actions.setLoading(true));
  dispatch({ type: APP_ADD_SUBJECT_SECTION_STUDENT_BULK });
  for (const [index, value] of data.subsectIDs.entries()) {
    await axios.post('api/registrar/addsubsectstud', {
      studsectID: data.studsectID,
      subsectID: value.subsectID,
    });
  }
  dispatch(actions.setLoading(false));
  message.success('Subject load added successfully!');
  dispatch({ type: APP_GET_ERRORS, payload: {} });
};

export function reducer(state, action) {
  switch (action.type) {
    case APP_ADD_SUBJECT_SECTION_STUDENT_BULK:
      return {
        ...state,
      };

    default:
      return state;
  }
}
