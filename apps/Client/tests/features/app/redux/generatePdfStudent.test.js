import {
  APP_GENERATE_PDF_STUDENT,
} from '../../../../src/features/app/redux/constants';

import {
  generatePdfStudent,
  reducer,
} from '../../../../src/features/app/redux/generatePdfStudent';

describe('app/redux/generatePdfStudent', () => {
  it('returns correct action by generatePdfStudent', () => {
    expect(generatePdfStudent()).toHaveProperty('type', APP_GENERATE_PDF_STUDENT);
  });

  it('handles action type APP_GENERATE_PDF_STUDENT correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_GENERATE_PDF_STUDENT }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
