import React from 'react';
import { shallow } from 'enzyme';
import { AllStudentFinalGrades } from '../../../src/features/app/AllStudentFinalGrades';

describe('app/AllStudentFinalGrades', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <AllStudentFinalGrades {...props} />
    );

    expect(
      renderedComponent.find('.app-all-student-final-grades').length
    ).toBe(1);
  });
});
