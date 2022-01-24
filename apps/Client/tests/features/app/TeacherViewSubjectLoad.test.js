import React from 'react';
import { shallow } from 'enzyme';
import { TeacherViewSubjectLoad } from '../../../src/features/app/TeacherViewSubjectLoad';

describe('app/TeacherViewSubjectLoad', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <TeacherViewSubjectLoad {...props} />
    );

    expect(
      renderedComponent.find('.app-teacher-view-subject-load').length
    ).toBe(1);
  });
});
