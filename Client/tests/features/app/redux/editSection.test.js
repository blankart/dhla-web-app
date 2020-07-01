import {
  APP_EDIT_SECTION,
} from '../../../../src/features/app/redux/constants';

import {
  editSection,
  reducer,
} from '../../../../src/features/app/redux/editSection';

describe('app/redux/editSection', () => {
  it('returns correct action by editSection', () => {
    expect(editSection()).toHaveProperty('type', APP_EDIT_SECTION);
  });

  it('handles action type APP_EDIT_SECTION correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_EDIT_SECTION }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
