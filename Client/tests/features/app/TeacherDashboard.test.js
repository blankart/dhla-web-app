import React from 'react';
import { shallow } from 'enzyme';
import { TeacherDashboard } from '../../../src/features/app/TeacherDashboard';

describe('app/TeacherDashboard', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <TeacherDashboard {...props} />
    );

    expect(
      renderedComponent.find('.app-teacher-dashboard').length
    ).toBe(1);
  });
});
