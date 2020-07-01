import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarAddNewLoad } from '../../../src/features/app/RegistrarAddNewLoad';

describe('app/RegistrarAddNewLoad', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarAddNewLoad {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-add-new-load').length
    ).toBe(1);
  });
});
