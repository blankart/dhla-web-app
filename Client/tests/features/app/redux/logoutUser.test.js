import {
  APP_LOGOUT_USER,
} from '../../../../src/features/app/redux/constants';

import {
  logoutUser,
  reducer,
} from '../../../../src/features/app/redux/logoutUser';

describe('app/redux/logoutUser', () => {
  it('returns correct action by logoutUser', () => {
    expect(logoutUser()).toHaveProperty('type', APP_LOGOUT_USER);
  });

  it('handles action type APP_LOGOUT_USER correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_LOGOUT_USER }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
