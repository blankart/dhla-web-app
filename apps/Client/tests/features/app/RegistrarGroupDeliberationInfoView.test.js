import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarGroupDeliberationInfoView } from '../../../src/features/app/RegistrarGroupDeliberationInfoView';

describe('app/RegistrarGroupDeliberationInfoView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarGroupDeliberationInfoView {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-group-deliberation-info-view').length
    ).toBe(1);
  });
});
