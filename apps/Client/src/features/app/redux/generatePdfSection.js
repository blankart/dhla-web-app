// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import { APP_GENERATE_PDF_SECTION, APP_GET_ERRORS } from './constants';
import * as actions from './actions';
import axios from 'axios';
import { message } from 'antd';

export const generatePdfSection = (data, position) => dispatch => {
  dispatch({ type: APP_GENERATE_PDF_SECTION });
  dispatch(actions.setLoading(true));
  axios({
    url: `api/${position.toLowerCase()}/reportcardsection`,
    method: 'POST',
    responseType: 'blob',
    data,
  })
    .then(async res => {
      dispatch(actions.setLoading(false));
      const file = new Blob([res.data], { type: 'application/pdf' });
      const fileUrl = URL.createObjectURL(file);
      window.open(fileUrl);
    })
    .catch(err => {
      dispatch(actions.setLoading(false));
      message.error(err.response.data.msg);
    });
};

export function reducer(state, action) {
  switch (action.type) {
    case APP_GENERATE_PDF_SECTION:
      return {
        ...state,
      };

    default:
      return state;
  }
}
