import {
  APP_SET_CURRENT_USER,
} from '../../../../src/features/app/redux/constants';

import {
  setCurrentUser,
  reducer,
} from '../../../../src/features/app/redux/setCurrentUser';

describe('app/redux/setCurrentUser', () => {
  it('returns correct action by setCurrentUser', () => {
    expect(setCurrentUser()).toHaveProperty('type', APP_SET_CURRENT_USER);
  });

  it('handles action type APP_SET_CURRENT_USER correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_SET_CURRENT_USER }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
