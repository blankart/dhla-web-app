import {
  APP_CREATE_ACCOUNT,
} from '../../../../src/features/app/redux/constants';

import {
  createAccount,
  reducer,
} from '../../../../src/features/app/redux/createAccount';

describe('app/redux/createAccount', () => {
  it('returns correct action by createAccount', () => {
    expect(createAccount()).toHaveProperty('type', APP_CREATE_ACCOUNT);
  });

  it('handles action type APP_CREATE_ACCOUNT correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_CREATE_ACCOUNT }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
