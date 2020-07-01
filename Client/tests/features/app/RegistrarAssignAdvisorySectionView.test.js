import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarAssignAdvisorySectionView } from '../../../src/features/app/RegistrarAssignAdvisorySectionView';

describe('app/RegistrarAssignAdvisorySectionView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarAssignAdvisorySectionView {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-assign-advisory-section-view').length
    ).toBe(1);
  });
});
