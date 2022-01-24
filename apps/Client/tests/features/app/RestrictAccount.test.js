import React from 'react';
import { shallow } from 'enzyme';
import { RestrictAccount } from '../../../src/features/app/RestrictAccount';

describe('app/RestrictAccount', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RestrictAccount {...props} />
    );

    expect(
      renderedComponent.find('.app-restrict-account').length
    ).toBe(1);
  });
});
