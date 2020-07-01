import {
  APP_EDIT_SUBCOMPONENT,
} from '../../../../src/features/app/redux/constants';

import {
  editSubcomponent,
  reducer,
} from '../../../../src/features/app/redux/editSubcomponent';

describe('app/redux/editSubcomponent', () => {
  it('returns correct action by editSubcomponent', () => {
    expect(editSubcomponent()).toHaveProperty('type', APP_EDIT_SUBCOMPONENT);
  });

  it('handles action type APP_EDIT_SUBCOMPONENT correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_EDIT_SUBCOMPONENT }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
