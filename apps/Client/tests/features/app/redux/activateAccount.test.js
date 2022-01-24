import {
  APP_ACTIVATE_ACCOUNT,
} from '../../../../src/features/app/redux/constants';

import {
  activateAccount,
  reducer,
} from '../../../../src/features/app/redux/activateAccount';

describe('app/redux/activateAccount', () => {
  it('returns correct action by activateAccount', () => {
    expect(activateAccount()).toHaveProperty('type', APP_ACTIVATE_ACCOUNT);
  });

  it('handles action type APP_ACTIVATE_ACCOUNT correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_ACTIVATE_ACCOUNT }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
