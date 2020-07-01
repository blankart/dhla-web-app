import {
  APP_SUBMIT_CLASS_RECORD,
} from '../../../../src/features/app/redux/constants';

import {
  submitClassRecord,
  reducer,
} from '../../../../src/features/app/redux/submitClassRecord';

describe('app/redux/submitClassRecord', () => {
  it('returns correct action by submitClassRecord', () => {
    expect(submitClassRecord()).toHaveProperty('type', APP_SUBMIT_CLASS_RECORD);
  });

  it('handles action type APP_SUBMIT_CLASS_RECORD correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_SUBMIT_CLASS_RECORD }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
