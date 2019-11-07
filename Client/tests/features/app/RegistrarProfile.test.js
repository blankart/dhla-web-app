import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarProfile } from '../../../src/features/app/RegistrarProfile';

describe('app/RegistrarProfile', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarProfile {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-profile').length
    ).toBe(1);
  });
});
