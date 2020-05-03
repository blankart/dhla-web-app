import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarAddRecordView } from '../../../src/features/app/RegistrarAddRecordView';

describe('app/RegistrarAddRecordView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarAddRecordView {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-add-record-view').length
    ).toBe(1);
  });
});
