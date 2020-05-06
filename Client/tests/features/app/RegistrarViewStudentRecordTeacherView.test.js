import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarViewStudentRecordTeacherView } from '../../../src/features/app/RegistrarViewStudentRecordTeacherView';

describe('app/RegistrarViewStudentRecordTeacherView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarViewStudentRecordTeacherView {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-view-student-record-teacher-view').length
    ).toBe(1);
  });
});
