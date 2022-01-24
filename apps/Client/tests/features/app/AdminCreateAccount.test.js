import React from 'react';
import { shallow } from 'enzyme';
import { AdminCreateAccount } from '../../../src/features/app/AdminCreateAccount';

describe('app/AdminCreateAccount', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <AdminCreateAccount {...props} />
    );

    expect(
      renderedComponent.find('.app-admin-create-account').length
    ).toBe(1);
  });
});
