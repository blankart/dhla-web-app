import {
  APP_UNASSIGN_ADVISORY_SECTION,
} from '../../../../src/features/app/redux/constants';

import {
  unassignAdvisorySection,
  reducer,
} from '../../../../src/features/app/redux/unassignAdvisorySection';

describe('app/redux/unassignAdvisorySection', () => {
  it('returns correct action by unassignAdvisorySection', () => {
    expect(unassignAdvisorySection()).toHaveProperty('type', APP_UNASSIGN_ADVISORY_SECTION);
  });

  it('handles action type APP_UNASSIGN_ADVISORY_SECTION correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_UNASSIGN_ADVISORY_SECTION }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
