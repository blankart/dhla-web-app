import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarEnrollStudents } from '../../../src/features/app/RegistrarEnrollStudents';

describe('app/RegistrarEnrollStudents', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarEnrollStudents {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-enroll-students').length
    ).toBe(1);
  });
});
