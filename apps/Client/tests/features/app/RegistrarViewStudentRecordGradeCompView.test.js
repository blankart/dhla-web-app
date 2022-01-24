import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarViewStudentRecordGradeCompView } from '../../../src/features/app/RegistrarViewStudentRecordGradeCompView';

describe('app/RegistrarViewStudentRecordGradeCompView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarViewStudentRecordGradeCompView {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-view-student-record-grade-comp-view').length
    ).toBe(1);
  });
});
