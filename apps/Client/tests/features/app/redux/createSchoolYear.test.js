import {
  APP_CREATE_SCHOOL_YEAR,
} from '../../../../src/features/app/redux/constants';

import {
  createSchoolYear,
  reducer,
} from '../../../../src/features/app/redux/createSchoolYear';

describe('app/redux/createSchoolYear', () => {
  it('returns correct action by createSchoolYear', () => {
    expect(createSchoolYear()).toHaveProperty('type', APP_CREATE_SCHOOL_YEAR);
  });

  it('handles action type APP_CREATE_SCHOOL_YEAR correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_CREATE_SCHOOL_YEAR }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
