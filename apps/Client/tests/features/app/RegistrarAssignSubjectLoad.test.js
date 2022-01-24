import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarAssignSubjectLoad } from '../../../src/features/app/RegistrarAssignSubjectLoad';

describe('app/RegistrarAssignSubjectLoad', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarAssignSubjectLoad {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-assign-subject-load').length
    ).toBe(1);
  });
});
