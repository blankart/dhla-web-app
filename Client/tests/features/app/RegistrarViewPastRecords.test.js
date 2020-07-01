import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarViewPastRecords } from '../../../src/features/app/RegistrarViewPastRecords';

describe('app/RegistrarViewPastRecords', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarViewPastRecords {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-view-past-records').length
    ).toBe(1);
  });
});
