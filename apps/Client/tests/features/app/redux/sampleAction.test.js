import {
  APP_SAMPLE_ACTION,
} from '../../../../src/features/app/redux/constants';

import {
  sampleAction,
  reducer,
} from '../../../../src/features/app/redux/sampleAction';

describe('app/redux/sampleAction', () => {
  it('returns correct action by sampleAction', () => {
    expect(sampleAction()).toHaveProperty('type', APP_SAMPLE_ACTION);
  });

  it('handles action type APP_SAMPLE_ACTION correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_SAMPLE_ACTION }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
