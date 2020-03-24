import React from 'react';
import { shallow } from 'enzyme';
import { TeacherManageGrades } from '../../../src/features/app/TeacherManageGrades';

describe('app/TeacherManageGrades', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <TeacherManageGrades {...props} />
    );

    expect(
      renderedComponent.find('.app-teacher-manage-grades').length
    ).toBe(1);
  });
});
