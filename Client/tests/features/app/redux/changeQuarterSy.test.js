import {
  APP_CHANGE_QUARTER_SY,
} from '../../../../src/features/app/redux/constants';

import {
  changeQuarterSy,
  reducer,
} from '../../../../src/features/app/redux/changeQuarterSy';

describe('app/redux/changeQuarterSy', () => {
  it('returns correct action by changeQuarterSy', () => {
    expect(changeQuarterSy()).toHaveProperty('type', APP_CHANGE_QUARTER_SY);
  });

  it('handles action type APP_CHANGE_QUARTER_SY correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_CHANGE_QUARTER_SY }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
