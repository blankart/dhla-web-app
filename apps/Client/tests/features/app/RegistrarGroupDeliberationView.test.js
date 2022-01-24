import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarGroupDeliberationView } from '../../../src/features/app/RegistrarGroupDeliberationView';

describe('app/RegistrarGroupDeliberationView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarGroupDeliberationView {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-group-deliberation-view').length
    ).toBe(1);
  });
});
