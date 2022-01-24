import React from 'react';
import { shallow } from 'enzyme';
import { StudentViewGrade } from '../../../src/features/app/StudentViewGrade';

describe('app/StudentViewGrade', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <StudentViewGrade {...props} />
    );

    expect(
      renderedComponent.find('.app-student-view-grade').length
    ).toBe(1);
  });
});
