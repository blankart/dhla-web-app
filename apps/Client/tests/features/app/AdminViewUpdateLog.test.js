import React from 'react';
import { shallow } from 'enzyme';
import { AdminViewUpdateLog } from '../../../src/features/app/AdminViewUpdateLog';

describe('app/AdminViewUpdateLog', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <AdminViewUpdateLog {...props} />
    );

    expect(
      renderedComponent.find('.app-admin-view-update-log').length
    ).toBe(1);
  });
});
