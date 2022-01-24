import React from 'react';
import { shallow } from 'enzyme';
import { TeacherAdviseeGrade } from '../../../src/features/app/TeacherAdviseeGrade';

describe('app/TeacherAdviseeGrade', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <TeacherAdviseeGrade {...props} />
    );

    expect(
      renderedComponent.find('.app-teacher-advisee-grade').length
    ).toBe(1);
  });
});
