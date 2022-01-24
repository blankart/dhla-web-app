import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarManageGrades } from '../../../src/features/app/RegistrarManageGrades';

describe('app/RegistrarManageGrades', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarManageGrades {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-manage-grades').length
    ).toBe(1);
  });
});
