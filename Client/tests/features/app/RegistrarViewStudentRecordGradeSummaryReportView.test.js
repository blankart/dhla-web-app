import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarViewStudentRecordGradeSummaryReportView } from '../../../src/features/app/RegistrarViewStudentRecordGradeSummaryReportView';

describe('app/RegistrarViewStudentRecordGradeSummaryReportView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarViewStudentRecordGradeSummaryReportView {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-view-student-record-grade-summary-report-view').length
    ).toBe(1);
  });
});
