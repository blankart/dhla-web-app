import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarEditRecordView } from '../../../src/features/app/RegistrarEditRecordView';

describe('app/RegistrarEditRecordView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarEditRecordView {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-edit-record-view').length
    ).toBe(1);
  });
});
