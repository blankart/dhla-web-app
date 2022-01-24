import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarViewEnrolled } from '../../../src/features/app/RegistrarViewEnrolled';

describe('app/RegistrarViewEnrolled', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarViewEnrolled {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-view-enrolled').length
    ).toBe(1);
  });
});
