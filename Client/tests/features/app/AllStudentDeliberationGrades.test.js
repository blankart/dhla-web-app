import React from 'react';
import { shallow } from 'enzyme';
import { AllStudentDeliberationGrades } from '../../../src/features/app/AllStudentDeliberationGrades';

describe('app/AllStudentDeliberationGrades', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <AllStudentDeliberationGrades {...props} />
    );

    expect(
      renderedComponent.find('.app-all-student-deliberation-grades').length
    ).toBe(1);
  });
});
