import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarAddRecord } from '../../../src/features/app/RegistrarAddRecord';

describe('app/RegistrarAddRecord', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarAddRecord {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-add-record').length
    ).toBe(1);
  });
});
