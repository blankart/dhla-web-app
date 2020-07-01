import {
  APP_DELETE_STUDENT_SECTION,
} from '../../../../src/features/app/redux/constants';

import {
  deleteStudentSection,
  reducer,
} from '../../../../src/features/app/redux/deleteStudentSection';

describe('app/redux/deleteStudentSection', () => {
  it('returns correct action by deleteStudentSection', () => {
    expect(deleteStudentSection()).toHaveProperty('type', APP_DELETE_STUDENT_SECTION);
  });

  it('handles action type APP_DELETE_STUDENT_SECTION correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_DELETE_STUDENT_SECTION }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
