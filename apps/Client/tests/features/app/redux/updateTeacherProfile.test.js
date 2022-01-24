import {
  APP_UPDATE_TEACHER_PROFILE,
} from '../../../../src/features/app/redux/constants';

import {
  updateTeacherProfile,
  reducer,
} from '../../../../src/features/app/redux/updateTeacherProfile';

describe('app/redux/updateTeacherProfile', () => {
  it('returns correct action by updateTeacherProfile', () => {
    expect(updateTeacherProfile()).toHaveProperty('type', APP_UPDATE_TEACHER_PROFILE);
  });

  it('handles action type APP_UPDATE_TEACHER_PROFILE correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_UPDATE_TEACHER_PROFILE }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
