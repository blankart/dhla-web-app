import {
  APP_END_SCHOOL_YEAR,
} from '../../../../src/features/app/redux/constants';

import {
  endSchoolYear,
  reducer,
} from '../../../../src/features/app/redux/endSchoolYear';

describe('app/redux/endSchoolYear', () => {
  it('returns correct action by endSchoolYear', () => {
    expect(endSchoolYear()).toHaveProperty('type', APP_END_SCHOOL_YEAR);
  });

  it('handles action type APP_END_SCHOOL_YEAR correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_END_SCHOOL_YEAR }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
