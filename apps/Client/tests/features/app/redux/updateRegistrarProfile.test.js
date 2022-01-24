import {
  APP_UPDATE_REGISTRAR_PROFILE,
} from '../../../../src/features/app/redux/constants';

import {
  updateRegistrarProfile,
  reducer,
} from '../../../../src/features/app/redux/updateRegistrarProfile';

describe('app/redux/updateRegistrarProfile', () => {
  it('returns correct action by updateRegistrarProfile', () => {
    expect(updateRegistrarProfile()).toHaveProperty('type', APP_UPDATE_REGISTRAR_PROFILE);
  });

  it('handles action type APP_UPDATE_REGISTRAR_PROFILE correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_UPDATE_REGISTRAR_PROFILE }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
