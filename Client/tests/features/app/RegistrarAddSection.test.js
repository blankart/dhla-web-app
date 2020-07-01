import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarAddSection } from '../../../src/features/app/RegistrarAddSection';

describe('app/RegistrarAddSection', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarAddSection {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-add-section').length
    ).toBe(1);
  });
});
