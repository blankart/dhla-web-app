import initialState from './initialState';
import { reducer as setCurrentUserReducer } from './setCurrentUser';
import { reducer as sampleActionReducer } from './sampleAction';
import { reducer as logoutUserReducer } from './logoutUser';
import { reducer as setLoadingReducer } from './setLoading';
import { reducer as loginUserReducer } from './loginUser';
import { reducer as getErrorsReducer } from './getErrors';
import { reducer as getCurrentProfileReducer } from './getCurrentProfile';
import { reducer as updateAdminProfileReducer } from './updateAdminProfile';
import { reducer as changePasswordReducer } from './changePassword';
import { reducer as createAccountReducer } from './createAccount';
import { reducer as getAccountListReducer } from './getAccountList';
import { reducer as activateAccountReducer } from './activateAccount';
import { reducer as deactivateAccountReducer } from './deactivateAccount';
import { reducer as updateDirectorProfileReducer } from './updateDirectorProfile';
import { reducer as updateTeacherProfileReducer } from './updateTeacherProfile';
import { reducer as updateRegistrarProfileReducer } from './updateRegistrarProfile';
import { reducer as updateParentProfileReducer } from './updateParentProfile';

const reducers = [
  setCurrentUserReducer,
  sampleActionReducer,
  logoutUserReducer,
  setLoadingReducer,
  loginUserReducer,
  getErrorsReducer,
  getCurrentProfileReducer,
  updateAdminProfileReducer,
  changePasswordReducer,
  createAccountReducer,
  getAccountListReducer,
  activateAccountReducer,
  deactivateAccountReducer,
  updateDirectorProfileReducer,
  updateTeacherProfileReducer,
  updateRegistrarProfileReducer,
  updateParentProfileReducer,
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Handle cross-topic actions here
    default:
      newState = state;
      break;
  }
  /* istanbul ignore next */
  return reducers.reduce((s, r) => r(s, action), newState);
}
