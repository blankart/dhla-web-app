import {
  APP_DELETE_SUBJECT_SECTION_STUDENT,
} from '../../../../src/features/app/redux/constants';

import {
  deleteSubjectSectionStudent,
  reducer,
} from '../../../../src/features/app/redux/deleteSubjectSectionStudent';

describe('app/redux/deleteSubjectSectionStudent', () => {
  it('returns correct action by deleteSubjectSectionStudent', () => {
    expect(deleteSubjectSectionStudent()).toHaveProperty('type', APP_DELETE_SUBJECT_SECTION_STUDENT);
  });

  it('handles action type APP_DELETE_SUBJECT_SECTION_STUDENT correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_DELETE_SUBJECT_SECTION_STUDENT }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
