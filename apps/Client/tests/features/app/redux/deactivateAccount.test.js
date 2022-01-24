import {
  APP_DEACTIVATE_ACCOUNT,
} from '../../../../src/features/app/redux/constants';

import {
  deactivateAccount,
  reducer,
} from '../../../../src/features/app/redux/deactivateAccount';

describe('app/redux/deactivateAccount', () => {
  it('returns correct action by deactivateAccount', () => {
    expect(deactivateAccount()).toHaveProperty('type', APP_DEACTIVATE_ACCOUNT);
  });

  it('handles action type APP_DEACTIVATE_ACCOUNT correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_DEACTIVATE_ACCOUNT }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
