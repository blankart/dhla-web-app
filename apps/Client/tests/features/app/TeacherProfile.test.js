import React from 'react';
import { shallow } from 'enzyme';
import { TeacherProfile } from '../../../src/features/app/TeacherProfile';

describe('app/TeacherProfile', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <TeacherProfile {...props} />
    );

    expect(
      renderedComponent.find('.app-teacher-profile').length
    ).toBe(1);
  });
});
