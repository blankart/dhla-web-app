import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarGroupDeliberationInfo } from '../../../src/features/app/RegistrarGroupDeliberationInfo';

describe('app/RegistrarGroupDeliberationInfo', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarGroupDeliberationInfo {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-group-deliberation-info').length
    ).toBe(1);
  });
});
