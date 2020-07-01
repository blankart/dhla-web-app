import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarEditRecord } from '../../../src/features/app/RegistrarEditRecord';

describe('app/RegistrarEditRecord', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarEditRecord {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-edit-record').length
    ).toBe(1);
  });
});
