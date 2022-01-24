import {
  APP_UPDATE_DIRECTOR_PROFILE,
} from '../../../../src/features/app/redux/constants';

import {
  updateDirectorProfile,
  reducer,
} from '../../../../src/features/app/redux/updateDirectorProfile';

describe('app/redux/updateDirectorProfile', () => {
  it('returns correct action by updateDirectorProfile', () => {
    expect(updateDirectorProfile()).toHaveProperty('type', APP_UPDATE_DIRECTOR_PROFILE);
  });

  it('handles action type APP_UPDATE_DIRECTOR_PROFILE correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_UPDATE_DIRECTOR_PROFILE }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
