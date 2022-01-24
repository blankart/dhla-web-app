import {
  APP_UNASSIGN_PARENT,
} from '../../../../src/features/app/redux/constants';

import {
  unassignParent,
  reducer,
} from '../../../../src/features/app/redux/unassignParent';

describe('app/redux/unassignParent', () => {
  it('returns correct action by unassignParent', () => {
    expect(unassignParent()).toHaveProperty('type', APP_UNASSIGN_PARENT);
  });

  it('handles action type APP_UNASSIGN_PARENT correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_UNASSIGN_PARENT }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
