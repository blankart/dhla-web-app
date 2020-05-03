import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarSubcomponent } from '../../../src/features/app/RegistrarSubcomponent';

describe('app/RegistrarSubcomponent', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarSubcomponent {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-subcomponent').length
    ).toBe(1);
  });
});
