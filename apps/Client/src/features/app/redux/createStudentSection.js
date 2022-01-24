// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import { APP_CREATE_STUDENT_SECTION, APP_GET_ERRORS } from './constants';
import * as actions from './actions';
import axios from 'axios';
import { message } from 'antd';

export const createStudentSection = (data, setState, subsect) => dispatch => {
  dispatch(actions.setLoading(true));
  dispatch({ type: APP_CREATE_STUDENT_SECTION });
  axios
    .post('api/registrar/createstudentsection', data)
    .then(res => {
      dispatch(actions.setLoading(false));
      message.success(`Student added successfully!`);
      dispatch({ type: APP_GET_ERRORS, payload: {} });
      if (typeof setState !== 'undefined' && typeof subsect !== 'undefined') {
        if (subsect.length != 0) {
          setState({
            showModal: true,
            selectedStudSectID: res.data.studsectID,
            selectedSubsect: [],
          });
        }
      }
    })
    .catch(err => {
      dispatch(actions.setLoading(false));
      dispatch({ type: APP_GET_ERRORS, payload: err.response.data });
      message.error(err.response.data.studentName);
    });
};

export function reducer(state, action) {
  switch (action.type) {
    case APP_CREATE_STUDENT_SECTION:
      return {
        ...state,
      };

    default:
      return state;
  }
}
