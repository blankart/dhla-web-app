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
import { reducer as addSectionReducer } from './addSection';
import { reducer as editSectionReducer } from './editSection';
import { reducer as deleteSectionReducer } from './deleteSection';
import { reducer as createStudentSectionReducer } from './createStudentSection';
import { reducer as deleteStudentSectionReducer } from './deleteStudentSection';
import { reducer as assignAdvisorySectionReducer } from './assignAdvisorySection';
import { reducer as unassignAdvisorySectionReducer } from './unassignAdvisorySection';
import { reducer as createSubjectSectionReducer } from './createSubjectSection';
import { reducer as deleteSubjectSectionReducer } from './deleteSubjectSection';
import { reducer as addSubjectSectionStudentReducer } from './addSubjectSectionStudent';
import { reducer as deleteSubjectSectionStudentReducer } from './deleteSubjectSectionStudent';
import { reducer as addNewSubcomponentReducer } from './addNewSubcomponent';
import { reducer as editSubcomponentReducer } from './editSubcomponent';
import { reducer as deleteSubcomponentReducer } from './deleteSubcomponent';
import { reducer as addNewRecordReducer } from './addNewRecord';
import { reducer as deleteRecordReducer } from './deleteRecord';
import { reducer as changeTransmutationReducer } from './changeTransmutation';
import { reducer as editRecordReducer } from './editRecord';
import { reducer as setDeadlineAllReducer } from './setDeadlineAll';
import { reducer as setDeadlineReducer } from './setDeadline';
import { reducer as removeDeadlineReducer } from './removeDeadline';
import { reducer as createSchoolYearReducer } from './createSchoolYear';
import { reducer as changeQuarterSyReducer } from './changeQuarterSy';
import { reducer as endSchoolYearReducer } from './endSchoolYear';
import { reducer as addSubjectSectionStudentBulkReducer } from './addSubjectSectionStudentBulk';
import { reducer as submitClassRecordReducer } from './submitClassRecord';
import { reducer as postClassRecordReducer } from './postClassRecord';
import { reducer as revertClassRecordReducer } from './revertClassRecord';
import { reducer as generatePdfStudentReducer } from './generatePdfStudent';
import { reducer as generatePdfSectionReducer } from './generatePdfSection';
import { reducer as restrictAccountReducer } from './restrictAccount';
import { reducer as unrestrictAccountReducer } from './unrestrictAccount';
import { reducer as updateCashierProfileReducer } from './updateCashierProfile';
import { reducer as updateStudentProfileReducer } from './updateStudentProfile';
import { reducer as assignParentReducer } from './assignParent';
import { reducer as unassignParentReducer } from './unassignParent';

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
  addSectionReducer,
  editSectionReducer,
  deleteSectionReducer,
  createStudentSectionReducer,
  deleteStudentSectionReducer,
  assignAdvisorySectionReducer,
  unassignAdvisorySectionReducer,
  createSubjectSectionReducer,
  deleteSubjectSectionReducer,
  addSubjectSectionStudentReducer,
  deleteSubjectSectionStudentReducer,
  addNewSubcomponentReducer,
  editSubcomponentReducer,
  deleteSubcomponentReducer,
  addNewRecordReducer,
  deleteRecordReducer,
  changeTransmutationReducer,
  editRecordReducer,
  setDeadlineAllReducer,
  setDeadlineReducer,
  removeDeadlineReducer,
  createSchoolYearReducer,
  changeQuarterSyReducer,
  endSchoolYearReducer,
  addSubjectSectionStudentBulkReducer,
  submitClassRecordReducer,
  postClassRecordReducer,
  revertClassRecordReducer,
  generatePdfStudentReducer,
  generatePdfSectionReducer,
  restrictAccountReducer,
  unrestrictAccountReducer,
  updateCashierProfileReducer,
  updateStudentProfileReducer,
  assignParentReducer,
  unassignParentReducer,
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
