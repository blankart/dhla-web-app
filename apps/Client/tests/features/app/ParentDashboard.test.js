import React from 'react';
import { shallow } from 'enzyme';
import { ParentDashboard } from '../../../src/features/app/ParentDashboard';

describe('app/ParentDashboard', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <ParentDashboard {...props} />
    );

    expect(
      renderedComponent.find('.app-parent-dashboard').length
    ).toBe(1);
  });
});
