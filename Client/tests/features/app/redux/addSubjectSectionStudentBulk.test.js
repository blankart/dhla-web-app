import {
  APP_ADD_SUBJECT_SECTION_STUDENT_BULK,
} from '../../../../src/features/app/redux/constants';

import {
  addSubjectSectionStudentBulk,
  reducer,
} from '../../../../src/features/app/redux/addSubjectSectionStudentBulk';

describe('app/redux/addSubjectSectionStudentBulk', () => {
  it('returns correct action by addSubjectSectionStudentBulk', () => {
    expect(addSubjectSectionStudentBulk()).toHaveProperty('type', APP_ADD_SUBJECT_SECTION_STUDENT_BULK);
  });

  it('handles action type APP_ADD_SUBJECT_SECTION_STUDENT_BULK correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_ADD_SUBJECT_SECTION_STUDENT_BULK }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
