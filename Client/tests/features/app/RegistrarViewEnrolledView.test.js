import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarViewEnrolledView } from '../../../src/features/app/RegistrarViewEnrolledView';

describe('app/RegistrarViewEnrolledView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarViewEnrolledView {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-view-enrolled-view').length
    ).toBe(1);
  });
});
