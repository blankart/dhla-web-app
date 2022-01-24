// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import {
  APP_SAMPLE_ACTION,
} from './constants';

export function sampleAction() {
  return {
    type: APP_SAMPLE_ACTION,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case APP_SAMPLE_ACTION:
      return {
        ...state,
        showLoading: true
      };

    default:
      return state;
  }
}
