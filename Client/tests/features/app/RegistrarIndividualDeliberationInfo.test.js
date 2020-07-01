import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarIndividualDeliberationInfo } from '../../../src/features/app/RegistrarIndividualDeliberationInfo';

describe('app/RegistrarIndividualDeliberationInfo', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarIndividualDeliberationInfo {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-individual-deliberation-info').length
    ).toBe(1);
  });
});
