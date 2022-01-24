import {
  APP_CHANGE_TRANSMUTATION,
} from '../../../../src/features/app/redux/constants';

import {
  changeTransmutation,
  reducer,
} from '../../../../src/features/app/redux/changeTransmutation';

describe('app/redux/changeTransmutation', () => {
  it('returns correct action by changeTransmutation', () => {
    expect(changeTransmutation()).toHaveProperty('type', APP_CHANGE_TRANSMUTATION);
  });

  it('handles action type APP_CHANGE_TRANSMUTATION correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_CHANGE_TRANSMUTATION }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
