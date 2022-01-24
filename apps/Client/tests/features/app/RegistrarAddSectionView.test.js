import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarAddSectionView } from '../../../src/features/app/RegistrarAddSectionView';

describe('app/RegistrarAddSectionView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarAddSectionView {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-add-section-view').length
    ).toBe(1);
  });
});
