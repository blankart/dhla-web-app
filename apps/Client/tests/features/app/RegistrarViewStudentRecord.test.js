import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarViewStudentRecord } from '../../../src/features/app/RegistrarViewStudentRecord';

describe('app/RegistrarViewStudentRecord', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarViewStudentRecord {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-view-student-record').length
    ).toBe(1);
  });
});
