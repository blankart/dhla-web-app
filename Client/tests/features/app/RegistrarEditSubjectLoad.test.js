import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarEditSubjectLoad } from '../../../src/features/app/RegistrarEditSubjectLoad';

describe('app/RegistrarEditSubjectLoad', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarEditSubjectLoad {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-edit-subject-load').length
    ).toBe(1);
  });
});
