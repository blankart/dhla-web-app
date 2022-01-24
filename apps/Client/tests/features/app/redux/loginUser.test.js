import {
  APP_LOGIN_USER,
} from '../../../../src/features/app/redux/constants';

import {
  loginUser,
  reducer,
} from '../../../../src/features/app/redux/loginUser';

describe('app/redux/loginUser', () => {
  it('returns correct action by loginUser', () => {
    expect(loginUser()).toHaveProperty('type', APP_LOGIN_USER);
  });

  it('handles action type APP_LOGIN_USER correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_LOGIN_USER }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
