import {
  APP_EDIT_RECORD,
} from '../../../../src/features/app/redux/constants';

import {
  editRecord,
  reducer,
} from '../../../../src/features/app/redux/editRecord';

describe('app/redux/editRecord', () => {
  it('returns correct action by editRecord', () => {
    expect(editRecord()).toHaveProperty('type', APP_EDIT_RECORD);
  });

  it('handles action type APP_EDIT_RECORD correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_EDIT_RECORD }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
