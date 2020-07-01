import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarViewStudentRecordStudent } from '../../../src/features/app/RegistrarViewStudentRecordStudent';

describe('app/RegistrarViewStudentRecordStudent', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarViewStudentRecordStudent {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-view-student-record-student').length
    ).toBe(1);
  });
});
