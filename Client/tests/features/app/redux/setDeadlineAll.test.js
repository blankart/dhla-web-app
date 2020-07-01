import {
  APP_SET_DEADLINE_ALL,
} from '../../../../src/features/app/redux/constants';

import {
  setDeadlineAll,
  reducer,
} from '../../../../src/features/app/redux/setDeadlineAll';

describe('app/redux/setDeadlineAll', () => {
  it('returns correct action by setDeadlineAll', () => {
    expect(setDeadlineAll()).toHaveProperty('type', APP_SET_DEADLINE_ALL);
  });

  it('handles action type APP_SET_DEADLINE_ALL correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_SET_DEADLINE_ALL }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
