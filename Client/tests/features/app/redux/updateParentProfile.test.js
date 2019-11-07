import {
  APP_UPDATE_PARENT_PROFILE,
} from '../../../../src/features/app/redux/constants';

import {
  updateParentProfile,
  reducer,
} from '../../../../src/features/app/redux/updateParentProfile';

describe('app/redux/updateParentProfile', () => {
  it('returns correct action by updateParentProfile', () => {
    expect(updateParentProfile()).toHaveProperty('type', APP_UPDATE_PARENT_PROFILE);
  });

  it('handles action type APP_UPDATE_PARENT_PROFILE correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_UPDATE_PARENT_PROFILE }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
