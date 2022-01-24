import {
  APP_GET_ERRORS,
} from '../../../../src/features/app/redux/constants';

import {
  getErrors,
  reducer,
} from '../../../../src/features/app/redux/getErrors';

describe('app/redux/getErrors', () => {
  it('returns correct action by getErrors', () => {
    expect(getErrors()).toHaveProperty('type', APP_GET_ERRORS);
  });

  it('handles action type APP_GET_ERRORS correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_GET_ERRORS }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
