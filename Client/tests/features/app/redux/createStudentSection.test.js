import {
  APP_CREATE_STUDENT_SECTION,
} from '../../../../src/features/app/redux/constants';

import {
  createStudentSection,
  reducer,
} from '../../../../src/features/app/redux/createStudentSection';

describe('app/redux/createStudentSection', () => {
  it('returns correct action by createStudentSection', () => {
    expect(createStudentSection()).toHaveProperty('type', APP_CREATE_STUDENT_SECTION);
  });

  it('handles action type APP_CREATE_STUDENT_SECTION correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_CREATE_STUDENT_SECTION }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
