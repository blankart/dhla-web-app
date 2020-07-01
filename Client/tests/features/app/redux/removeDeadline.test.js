import {
  APP_REMOVE_DEADLINE,
} from '../../../../src/features/app/redux/constants';

import {
  removeDeadline,
  reducer,
} from '../../../../src/features/app/redux/removeDeadline';

describe('app/redux/removeDeadline', () => {
  it('returns correct action by removeDeadline', () => {
    expect(removeDeadline()).toHaveProperty('type', APP_REMOVE_DEADLINE);
  });

  it('handles action type APP_REMOVE_DEADLINE correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_REMOVE_DEADLINE }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
