import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarListSections } from '../../../src/features/app/RegistrarListSections';

describe('app/RegistrarListSections', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarListSections {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-list-sections').length
    ).toBe(1);
  });
});
