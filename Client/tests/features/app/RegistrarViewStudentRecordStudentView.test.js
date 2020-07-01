import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarViewStudentRecordStudentView } from '../../../src/features/app/RegistrarViewStudentRecordStudentView';

describe('app/RegistrarViewStudentRecordStudentView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarViewStudentRecordStudentView {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-view-student-record-student-view').length
    ).toBe(1);
  });
});
