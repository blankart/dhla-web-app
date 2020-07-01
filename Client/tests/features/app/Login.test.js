import React from 'react';
import { shallow } from 'enzyme';
import { Login } from '../../../src/features/app/Login';

describe('app/Login', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <Login {...props} />
    );

    expect(
      renderedComponent.find('.app-login').length
    ).toBe(1);
  });
});
