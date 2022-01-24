import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarIndividualDeliberation } from '../../../src/features/app/RegistrarIndividualDeliberation';

describe('app/RegistrarIndividualDeliberation', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarIndividualDeliberation {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-individual-deliberation').length
    ).toBe(1);
  });
});
