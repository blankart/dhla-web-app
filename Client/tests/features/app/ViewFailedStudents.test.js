import React from 'react';
import { shallow } from 'enzyme';
import { ViewFailedStudents } from '../../../src/features/app/ViewFailedStudents';

describe('app/ViewFailedStudents', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <ViewFailedStudents {...props} />
    );

    expect(
      renderedComponent.find('.app-view-failed-students').length
    ).toBe(1);
  });
});
