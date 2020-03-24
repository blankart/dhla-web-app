import React from 'react';
import { shallow } from 'enzyme';
import { TeacherViewSubjectLoadView } from '../../../src/features/app/TeacherViewSubjectLoadView';

describe('app/TeacherViewSubjectLoadView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <TeacherViewSubjectLoadView {...props} />
    );

    expect(
      renderedComponent.find('.app-teacher-view-subject-load-view').length
    ).toBe(1);
  });
});
