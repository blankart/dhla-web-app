import {
  APP_ASSIGN_ADVISORY_SECTION,
} from '../../../../src/features/app/redux/constants';

import {
  assignAdvisorySection,
  reducer,
} from '../../../../src/features/app/redux/assignAdvisorySection';

describe('app/redux/assignAdvisorySection', () => {
  it('returns correct action by assignAdvisorySection', () => {
    expect(assignAdvisorySection()).toHaveProperty('type', APP_ASSIGN_ADVISORY_SECTION);
  });

  it('handles action type APP_ASSIGN_ADVISORY_SECTION correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_ASSIGN_ADVISORY_SECTION }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
