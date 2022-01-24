import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarViewPastRecordsView } from '../../../src/features/app/RegistrarViewPastRecordsView';

describe('app/RegistrarViewPastRecordsView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarViewPastRecordsView {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-view-past-records-view').length
    ).toBe(1);
  });
});
