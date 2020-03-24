import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarViewSubjectLoad } from '../../../src/features/app/RegistrarViewSubjectLoad';

describe('app/RegistrarViewSubjectLoad', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarViewSubjectLoad {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-view-subject-load').length
    ).toBe(1);
  });
});
