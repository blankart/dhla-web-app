import {
  APP_ADD_SUBJECT_SECTION_STUDENT,
} from '../../../../src/features/app/redux/constants';

import {
  addSubjectSectionStudent,
  reducer,
} from '../../../../src/features/app/redux/addSubjectSectionStudent';

describe('app/redux/addSubjectSectionStudent', () => {
  it('returns correct action by addSubjectSectionStudent', () => {
    expect(addSubjectSectionStudent()).toHaveProperty('type', APP_ADD_SUBJECT_SECTION_STUDENT);
  });

  it('handles action type APP_ADD_SUBJECT_SECTION_STUDENT correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_ADD_SUBJECT_SECTION_STUDENT }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
