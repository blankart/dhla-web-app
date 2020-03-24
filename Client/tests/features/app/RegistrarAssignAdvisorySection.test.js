import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarAssignAdvisorySection } from '../../../src/features/app/RegistrarAssignAdvisorySection';

describe('app/RegistrarAssignAdvisorySection', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarAssignAdvisorySection {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-assign-advisory-section').length
    ).toBe(1);
  });
});
