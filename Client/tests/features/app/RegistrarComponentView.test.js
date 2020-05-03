import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarComponentView } from '../../../src/features/app/RegistrarComponentView';

describe('app/RegistrarComponentView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarComponentView {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-component-view').length
    ).toBe(1);
  });
});
