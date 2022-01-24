import {
  APP_DELETE_SECTION,
} from '../../../../src/features/app/redux/constants';

import {
  deleteSection,
  reducer,
} from '../../../../src/features/app/redux/deleteSection';

describe('app/redux/deleteSection', () => {
  it('returns correct action by deleteSection', () => {
    expect(deleteSection()).toHaveProperty('type', APP_DELETE_SECTION);
  });

  it('handles action type APP_DELETE_SECTION correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_DELETE_SECTION }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
