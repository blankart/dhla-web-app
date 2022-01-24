import React from 'react';
import { shallow } from 'enzyme';
import { AdminDashboard } from '../../../src/features/app/AdminDashboard';

describe('app/AdminDashboard', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <AdminDashboard {...props} />
    );

    expect(
      renderedComponent.find('.app-admin-dashboard').length
    ).toBe(1);
  });
});
