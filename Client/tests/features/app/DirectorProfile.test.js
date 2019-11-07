import React from 'react';
import { shallow } from 'enzyme';
import { DirectorProfile } from '../../../src/features/app/DirectorProfile';

describe('app/DirectorProfile', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DirectorProfile {...props} />
    );

    expect(
      renderedComponent.find('.app-director-profile').length
    ).toBe(1);
  });
});
