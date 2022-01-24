import {
  APP_RESTRICT_ACCOUNT,
} from '../../../../src/features/app/redux/constants';

import {
  restrictAccount,
  reducer,
} from '../../../../src/features/app/redux/restrictAccount';

describe('app/redux/restrictAccount', () => {
  it('returns correct action by restrictAccount', () => {
    expect(restrictAccount()).toHaveProperty('type', APP_RESTRICT_ACCOUNT);
  });

  it('handles action type APP_RESTRICT_ACCOUNT correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_RESTRICT_ACCOUNT }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
