import {
  APP_POST_CLASS_RECORD,
} from '../../../../src/features/app/redux/constants';

import {
  postClassRecord,
  reducer,
} from '../../../../src/features/app/redux/postClassRecord';

describe('app/redux/postClassRecord', () => {
  it('returns correct action by postClassRecord', () => {
    expect(postClassRecord()).toHaveProperty('type', APP_POST_CLASS_RECORD);
  });

  it('handles action type APP_POST_CLASS_RECORD correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_POST_CLASS_RECORD }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
