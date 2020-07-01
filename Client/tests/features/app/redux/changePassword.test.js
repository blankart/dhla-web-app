import {
  APP_CHANGE_PASSWORD,
} from '../../../../src/features/app/redux/constants';

import {
  changePassword,
  reducer,
} from '../../../../src/features/app/redux/changePassword';

describe('app/redux/changePassword', () => {
  it('returns correct action by changePassword', () => {
    expect(changePassword()).toHaveProperty('type', APP_CHANGE_PASSWORD);
  });

  it('handles action type APP_CHANGE_PASSWORD correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_CHANGE_PASSWORD }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
