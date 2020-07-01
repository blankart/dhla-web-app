import {
  APP_GENERATE_PDF_SECTION,
} from '../../../../src/features/app/redux/constants';

import {
  generatePdfSection,
  reducer,
} from '../../../../src/features/app/redux/generatePdfSection';

describe('app/redux/generatePdfSection', () => {
  it('returns correct action by generatePdfSection', () => {
    expect(generatePdfSection()).toHaveProperty('type', APP_GENERATE_PDF_SECTION);
  });

  it('handles action type APP_GENERATE_PDF_SECTION correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: APP_GENERATE_PDF_SECTION }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
