import React from 'react';
import { shallow } from 'enzyme';
import { ViewEditLog } from '../../../src/features/app/ViewEditLog';

describe('app/ViewEditLog', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <ViewEditLog {...props} />
    );

    expect(
      renderedComponent.find('.app-view-edit-log').length
    ).toBe(1);
  });
});
