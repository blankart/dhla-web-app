import {
  APP_UPDATE_STUDENT_PROFILE,
} from '../../../../src/features/app/redux/constants';

import {
  updateStudentProfile,
  reducer,
} from '../../../../src/features/app/redux/updateStudentProfile';

describe('app/redux/updateStudentProfile', () => {
  it('returns correct action by updateStudentProfile', () => {
    expect(updateStudentProfile()).toHaveProperty('type', APP_UPDATE_STUDENT_PROFILE);
  });

  it('handles action type APP_UPDATE_STUDENT_PROFILE correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_UPDATE_STUDENT_PROFILE }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
