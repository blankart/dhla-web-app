import {
  APP_UPDATE_CASHIER_PROFILE,
} from '../../../../src/features/app/redux/constants';

import {
  updateCashierProfile,
  reducer,
} from '../../../../src/features/app/redux/updateCashierProfile';

describe('app/redux/updateCashierProfile', () => {
  it('returns correct action by updateCashierProfile', () => {
    expect(updateCashierProfile()).toHaveProperty('type', APP_UPDATE_CASHIER_PROFILE);
  });

  it('handles action type APP_UPDATE_CASHIER_PROFILE correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_UPDATE_CASHIER_PROFILE }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
