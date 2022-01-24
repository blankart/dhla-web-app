import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarEnrollStudentsView } from '../../../src/features/app/RegistrarEnrollStudentsView';

describe('app/RegistrarEnrollStudentsView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarEnrollStudentsView {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-enroll-students-view').length
    ).toBe(1);
  });
});
