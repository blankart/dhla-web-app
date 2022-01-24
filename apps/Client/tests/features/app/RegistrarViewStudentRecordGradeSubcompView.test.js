import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarViewStudentRecordGradeSubcompView } from '../../../src/features/app/RegistrarViewStudentRecordGradeSubcompView';

describe('app/RegistrarViewStudentRecordGradeSubcompView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarViewStudentRecordGradeSubcompView {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-view-student-record-grade-subcomp-view').length
    ).toBe(1);
  });
});
