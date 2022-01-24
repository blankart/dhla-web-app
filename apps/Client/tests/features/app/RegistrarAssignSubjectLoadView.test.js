import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarAssignSubjectLoadView } from '../../../src/features/app/RegistrarAssignSubjectLoadView';

describe('app/RegistrarAssignSubjectLoadView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarAssignSubjectLoadView {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-assign-subject-load-view').length
    ).toBe(1);
  });
});
