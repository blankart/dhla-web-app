import {
  APP_SET_DEADLINE,
} from '../../../../src/features/app/redux/constants';

import {
  setDeadline,
  reducer,
} from '../../../../src/features/app/redux/setDeadline';

describe('app/redux/setDeadline', () => {
  it('returns correct action by setDeadline', () => {
    expect(setDeadline()).toHaveProperty('type', APP_SET_DEADLINE);
  });

  it('handles action type APP_SET_DEADLINE correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_SET_DEADLINE }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
