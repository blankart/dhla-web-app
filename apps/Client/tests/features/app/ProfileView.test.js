import React from 'react';
import { shallow } from 'enzyme';
import { ProfileView } from '../../../src/features/app/ProfileView';

describe('app/ProfileView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <ProfileView {...props} />
    );

    expect(
      renderedComponent.find('.app-profile-view').length
    ).toBe(1);
  });
});
