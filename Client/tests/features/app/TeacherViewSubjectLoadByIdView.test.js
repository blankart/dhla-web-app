import React from 'react';
import { shallow } from 'enzyme';
import { TeacherViewSubjectLoadByIdView } from '../../../src/features/app/TeacherViewSubjectLoadByIdView';

describe('app/TeacherViewSubjectLoadByIdView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <TeacherViewSubjectLoadByIdView {...props} />
    );

    expect(
      renderedComponent.find('.app-teacher-view-subject-load-by-id-view').length
    ).toBe(1);
  });
});
