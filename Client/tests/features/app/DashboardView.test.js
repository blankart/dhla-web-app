import React from 'react';
import { shallow } from 'enzyme';
import { DashboardView } from '../../../src/features/app/DashboardView';

describe('app/DashboardView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DashboardView {...props} />
    );

    expect(
      renderedComponent.find('.app-dashboard-view').length
    ).toBe(1);
  });
});
