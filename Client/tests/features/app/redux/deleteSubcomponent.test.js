import {
  APP_DELETE_SUBCOMPONENT,
} from '../../../../src/features/app/redux/constants';

import {
  deleteSubcomponent,
  reducer,
} from '../../../../src/features/app/redux/deleteSubcomponent';

describe('app/redux/deleteSubcomponent', () => {
  it('returns correct action by deleteSubcomponent', () => {
    expect(deleteSubcomponent()).toHaveProperty('type', APP_DELETE_SUBCOMPONENT);
  });

  it('handles action type APP_DELETE_SUBCOMPONENT correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_DELETE_SUBCOMPONENT }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
