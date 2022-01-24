import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarGroupDeliberation } from '../../../src/features/app/RegistrarGroupDeliberation';

describe('app/RegistrarGroupDeliberation', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarGroupDeliberation {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-group-deliberation').length
    ).toBe(1);
  });
});
