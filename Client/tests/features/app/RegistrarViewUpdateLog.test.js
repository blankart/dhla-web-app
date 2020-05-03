import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarViewUpdateLog } from '../../../src/features/app/RegistrarViewUpdateLog';

describe('app/RegistrarViewUpdateLog', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarViewUpdateLog {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-view-update-log').length
    ).toBe(1);
  });
});
