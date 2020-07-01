import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarComponent } from '../../../src/features/app/RegistrarComponent';

describe('app/RegistrarComponent', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarComponent {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-component').length
    ).toBe(1);
  });
});
