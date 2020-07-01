import {
  APP_ADD_NEW_RECORD,
} from '../../../../src/features/app/redux/constants';

import {
  addNewRecord,
  reducer,
} from '../../../../src/features/app/redux/addNewRecord';

describe('app/redux/addNewRecord', () => {
  it('returns correct action by addNewRecord', () => {
    expect(addNewRecord()).toHaveProperty('type', APP_ADD_NEW_RECORD);
  });

  it('handles action type APP_ADD_NEW_RECORD correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_ADD_NEW_RECORD }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
