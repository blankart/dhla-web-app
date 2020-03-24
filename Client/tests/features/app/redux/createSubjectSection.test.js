import {
  APP_CREATE_SUBJECT_SECTION,
} from '../../../../src/features/app/redux/constants';

import {
  createSubjectSection,
  reducer,
} from '../../../../src/features/app/redux/createSubjectSection';

describe('app/redux/createSubjectSection', () => {
  it('returns correct action by createSubjectSection', () => {
    expect(createSubjectSection()).toHaveProperty('type', APP_CREATE_SUBJECT_SECTION);
  });

  it('handles action type APP_CREATE_SUBJECT_SECTION correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_CREATE_SUBJECT_SECTION }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
