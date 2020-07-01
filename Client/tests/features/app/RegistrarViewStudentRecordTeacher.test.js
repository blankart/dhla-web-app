import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarViewStudentRecordTeacher } from '../../../src/features/app/RegistrarViewStudentRecordTeacher';

describe('app/RegistrarViewStudentRecordTeacher', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarViewStudentRecordTeacher {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-view-student-record-teacher').length
    ).toBe(1);
  });
});
