import React from 'react';
import { shallow } from 'enzyme';
import { AdminProfile } from '../../../src/features/app/AdminProfile';

describe('app/AdminProfile', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <AdminProfile {...props} />
    );

    expect(
      renderedComponent.find('.app-admin-profile').length
    ).toBe(1);
  });
});
