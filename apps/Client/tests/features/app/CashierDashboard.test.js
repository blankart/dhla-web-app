import React from 'react';
import { shallow } from 'enzyme';
import { CashierDashboard } from '../../../src/features/app/CashierDashboard';

describe('app/CashierDashboard', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <CashierDashboard {...props} />
    );

    expect(
      renderedComponent.find('.app-cashier-dashboard').length
    ).toBe(1);
  });
});
