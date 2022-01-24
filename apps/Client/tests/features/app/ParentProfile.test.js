import React from 'react';
import { shallow } from 'enzyme';
import { ParentProfile } from '../../../src/features/app/ParentProfile';

describe('app/ParentProfile', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <ParentProfile {...props} />
    );

    expect(
      renderedComponent.find('.app-parent-profile').length
    ).toBe(1);
  });
});
