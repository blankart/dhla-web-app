import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarViewStudentRecordSection } from '../../../src/features/app/RegistrarViewStudentRecordSection';

describe('app/RegistrarViewStudentRecordSection', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarViewStudentRecordSection {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-view-student-record-section').length
    ).toBe(1);
  });
});
