import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarViewStudentRecordGradeView } from '../../../src/features/app/RegistrarViewStudentRecordGradeView';

describe('app/RegistrarViewStudentRecordGradeView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarViewStudentRecordGradeView {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-view-student-record-grade-view').length
    ).toBe(1);
  });
});
