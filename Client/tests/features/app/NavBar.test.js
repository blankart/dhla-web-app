import React from 'react';
import { shallow } from 'enzyme';
import { NavBar } from '../../../src/features/app/NavBar';

describe('app/NavBar', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <NavBar {...props} />
    );

    expect(
      renderedComponent.find('.app-nav-bar').length
    ).toBe(1);
  });
});
