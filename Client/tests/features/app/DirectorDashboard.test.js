import React from 'react';
import { shallow } from 'enzyme';
import { DirectorDashboard } from '../../../src/features/app/DirectorDashboard';

describe('app/DirectorDashboard', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DirectorDashboard {...props} />
    );

    expect(
      renderedComponent.find('.app-director-dashboard').length
    ).toBe(1);
  });
});
