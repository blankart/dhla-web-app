import React from 'react';
import { shallow } from 'enzyme';
import { CashierProfile } from '../../../src/features/app/CashierProfile';

describe('app/CashierProfile', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <CashierProfile {...props} />
    );

    expect(
      renderedComponent.find('.app-cashier-profile').length
    ).toBe(1);
  });
});
