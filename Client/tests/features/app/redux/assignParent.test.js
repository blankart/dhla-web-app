import {
  APP_ASSIGN_PARENT,
} from '../../../../src/features/app/redux/constants';

import {
  assignParent,
  reducer,
} from '../../../../src/features/app/redux/assignParent';

describe('app/redux/assignParent', () => {
  it('returns correct action by assignParent', () => {
    expect(assignParent()).toHaveProperty('type', APP_ASSIGN_PARENT);
  });

  it('handles action type APP_ASSIGN_PARENT correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_ASSIGN_PARENT }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
