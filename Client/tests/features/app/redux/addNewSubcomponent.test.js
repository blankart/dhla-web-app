import {
  APP_ADD_NEW_SUBCOMPONENT,
} from '../../../../src/features/app/redux/constants';

import {
  addNewSubcomponent,
  reducer,
} from '../../../../src/features/app/redux/addNewSubcomponent';

describe('app/redux/addNewSubcomponent', () => {
  it('returns correct action by addNewSubcomponent', () => {
    expect(addNewSubcomponent()).toHaveProperty('type', APP_ADD_NEW_SUBCOMPONENT);
  });

  it('handles action type APP_ADD_NEW_SUBCOMPONENT correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_ADD_NEW_SUBCOMPONENT }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
