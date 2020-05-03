import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarManageGradesView } from '../../../src/features/app/RegistrarManageGradesView';

describe('app/RegistrarManageGradesView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarManageGradesView {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-manage-grades-view').length
    ).toBe(1);
  });
});
