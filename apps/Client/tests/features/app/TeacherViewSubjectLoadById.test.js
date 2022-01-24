import React from 'react';
import { shallow } from 'enzyme';
import { TeacherViewSubjectLoadById } from '../../../src/features/app/TeacherViewSubjectLoadById';

describe('app/TeacherViewSubjectLoadById', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <TeacherViewSubjectLoadById {...props} />
    );

    expect(
      renderedComponent.find('.app-teacher-view-subject-load-by-id').length
    ).toBe(1);
  });
});
