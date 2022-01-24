import {
  APP_UPDATE_ADMIN_PROFILE,
} from '../../../../src/features/app/redux/constants';

import {
  updateAdminProfile,
  reducer,
} from '../../../../src/features/app/redux/updateAdminProfile';

describe('app/redux/updateAdminProfile', () => {
  it('returns correct action by updateAdminProfile', () => {
    expect(updateAdminProfile()).toHaveProperty('type', APP_UPDATE_ADMIN_PROFILE);
  });

  it('handles action type APP_UPDATE_ADMIN_PROFILE correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_UPDATE_ADMIN_PROFILE }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
