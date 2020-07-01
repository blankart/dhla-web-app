import React from 'react';
import { shallow } from 'enzyme';
import { StudentProfile } from '../../../src/features/app/StudentProfile';

describe('app/StudentProfile', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <StudentProfile {...props} />
    );

    expect(
      renderedComponent.find('.app-student-profile').length
    ).toBe(1);
  });
});
