import {
  APP_ADD_SECTION,
} from '../../../../src/features/app/redux/constants';

import {
  addSection,
  reducer,
} from '../../../../src/features/app/redux/addSection';

describe('app/redux/addSection', () => {
  it('returns correct action by addSection', () => {
    expect(addSection()).toHaveProperty('type', APP_ADD_SECTION);
  });

  it('handles action type APP_ADD_SECTION correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_ADD_SECTION }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
