import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarSummaryReportView } from '../../../src/features/app/RegistrarSummaryReportView';

describe('app/RegistrarSummaryReportView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarSummaryReportView {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-summary-report-view').length
    ).toBe(1);
  });
});
