import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarIndividualDeliberationInfoView } from '../../../src/features/app/RegistrarIndividualDeliberationInfoView';

describe('app/RegistrarIndividualDeliberationInfoView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarIndividualDeliberationInfoView {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-individual-deliberation-info-view').length
    ).toBe(1);
  });
});
