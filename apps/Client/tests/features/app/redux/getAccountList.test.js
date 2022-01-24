import {
  APP_GET_ACCOUNT_LIST,
} from '../../../../src/features/app/redux/constants';

import {
  getAccountList,
  reducer,
} from '../../../../src/features/app/redux/getAccountList';

describe('app/redux/getAccountList', () => {
  it('returns correct action by getAccountList', () => {
    expect(getAccountList()).toHaveProperty('type', APP_GET_ACCOUNT_LIST);
  });

  it('handles action type APP_GET_ACCOUNT_LIST correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_GET_ACCOUNT_LIST }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
