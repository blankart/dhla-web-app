import {
  APP_DELETE_SUBJECT_SECTION,
} from '../../../../src/features/app/redux/constants';

import {
  deleteSubjectSection,
  reducer,
} from '../../../../src/features/app/redux/deleteSubjectSection';

describe('app/redux/deleteSubjectSection', () => {
  it('returns correct action by deleteSubjectSection', () => {
    expect(deleteSubjectSection()).toHaveProperty('type', APP_DELETE_SUBJECT_SECTION);
  });

  it('handles action type APP_DELETE_SUBJECT_SECTION correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_DELETE_SUBJECT_SECTION }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
