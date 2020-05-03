import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarSummaryReport } from '../../../src/features/app/RegistrarSummaryReport';

describe('app/RegistrarSummaryReport', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarSummaryReport {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-summary-report').length
    ).toBe(1);
  });
});
