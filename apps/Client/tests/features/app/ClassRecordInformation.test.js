import React from 'react';
import { shallow } from 'enzyme';
import { ClassRecordInformation } from '../../../src/features/app/ClassRecordInformation';

describe('app/ClassRecordInformation', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <ClassRecordInformation {...props} />
    );

    expect(
      renderedComponent.find('.app-class-record-information').length
    ).toBe(1);
  });
});
