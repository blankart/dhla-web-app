import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarIndividualDeliberationView } from '../../../src/features/app/RegistrarIndividualDeliberationView';

describe('app/RegistrarIndividualDeliberationView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarIndividualDeliberationView {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-individual-deliberation-view').length
    ).toBe(1);
  });
});
