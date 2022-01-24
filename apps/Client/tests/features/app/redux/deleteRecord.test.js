import {
  APP_DELETE_RECORD,
} from '../../../../src/features/app/redux/constants';

import {
  deleteRecord,
  reducer,
} from '../../../../src/features/app/redux/deleteRecord';

describe('app/redux/deleteRecord', () => {
  it('returns correct action by deleteRecord', () => {
    expect(deleteRecord()).toHaveProperty('type', APP_DELETE_RECORD);
  });

  it('handles action type APP_DELETE_RECORD correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_DELETE_RECORD }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
