import React from 'react';
import { shallow } from 'enzyme';
import { StudentDashboard } from '../../../src/features/app/StudentDashboard';

describe('app/StudentDashboard', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <StudentDashboard {...props} />
    );

    expect(
      renderedComponent.find('.app-student-dashboard').length
    ).toBe(1);
  });
});
