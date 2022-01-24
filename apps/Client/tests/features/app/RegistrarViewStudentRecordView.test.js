import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarViewStudentRecordView } from '../../../src/features/app/RegistrarViewStudentRecordView';

describe('app/RegistrarViewStudentRecordView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarViewStudentRecordView {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-view-student-record-view').length
    ).toBe(1);
  });
});
