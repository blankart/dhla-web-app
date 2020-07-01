import {
  APP_SET_LOADING,
} from '../../../../src/features/app/redux/constants';

import {
  setLoading,
  reducer,
} from '../../../../src/features/app/redux/setLoading';

describe('app/redux/setLoading', () => {
  it('returns correct action by setLoading', () => {
    expect(setLoading()).toHaveProperty('type', APP_SET_LOADING);
  });

  it('handles action type APP_SET_LOADING correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_SET_LOADING }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
