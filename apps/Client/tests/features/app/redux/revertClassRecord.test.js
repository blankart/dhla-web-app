import {
  APP_REVERT_CLASS_RECORD,
} from '../../../../src/features/app/redux/constants';

import {
  revertClassRecord,
  reducer,
} from '../../../../src/features/app/redux/revertClassRecord';

describe('app/redux/revertClassRecord', () => {
  it('returns correct action by revertClassRecord', () => {
    expect(revertClassRecord()).toHaveProperty('type', APP_REVERT_CLASS_RECORD);
  });

  it('handles action type APP_REVERT_CLASS_RECORD correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_REVERT_CLASS_RECORD }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
