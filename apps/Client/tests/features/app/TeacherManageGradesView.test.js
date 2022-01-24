import React from 'react';
import { shallow } from 'enzyme';
import { TeacherManageGradesView } from '../../../src/features/app/TeacherManageGradesView';

describe('app/TeacherManageGradesView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <TeacherManageGradesView {...props} />
    );

    expect(
      renderedComponent.find('.app-teacher-manage-grades-view').length
    ).toBe(1);
  });
});
