import {
  APP_GET_CURRENT_PROFILE,
} from '../../../../src/features/app/redux/constants';

import {
  getCurrentProfile,
  reducer,
} from '../../../../src/features/app/redux/getCurrentProfile';

describe('app/redux/getCurrentProfile', () => {
  it('returns correct action by getCurrentProfile', () => {
    expect(getCurrentProfile()).toHaveProperty('type', APP_GET_CURRENT_PROFILE);
  });

  it('handles action type APP_GET_CURRENT_PROFILE correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_GET_CURRENT_PROFILE }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
