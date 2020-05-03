import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarSubcomponentView } from '../../../src/features/app/RegistrarSubcomponentView';

describe('app/RegistrarSubcomponentView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarSubcomponentView {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-subcomponent-view').length
    ).toBe(1);
  });
});
