import React from 'react';
import { shallow } from 'enzyme';
import { AdminActivateAccount } from '../../../src/features/app/AdminActivateAccount';

describe('app/AdminActivateAccount', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <AdminActivateAccount {...props} />
    );

    expect(
      renderedComponent.find('.app-admin-activate-account').length
    ).toBe(1);
  });
});
