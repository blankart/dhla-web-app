import {
  APP_UNRESTRICT_ACCOUNT,
} from '../../../../src/features/app/redux/constants';

import {
  unrestrictAccount,
  reducer,
} from '../../../../src/features/app/redux/unrestrictAccount';

describe('app/redux/unrestrictAccount', () => {
  it('returns correct action by unrestrictAccount', () => {
    expect(unrestrictAccount()).toHaveProperty('type', APP_UNRESTRICT_ACCOUNT);
  });

  it('handles action type APP_UNRESTRICT_ACCOUNT correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_UNRESTRICT_ACCOUNT }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
