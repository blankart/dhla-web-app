import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarDashboard } from '../../../src/features/app/RegistrarDashboard';

describe('app/RegistrarDashboard', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarDashboard {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-dashboard').length
    ).toBe(1);
  });
});
