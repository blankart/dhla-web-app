import React from 'react';
import { shallow } from 'enzyme';
import { TeacherSummaryPerQuarter } from '../../../src/features/app/TeacherSummaryPerQuarter';

describe('app/TeacherSummaryPerQuarter', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <TeacherSummaryPerQuarter {...props} />
    );

    expect(
      renderedComponent.find('.app-teacher-summary-per-quarter').length
    ).toBe(1);
  });
});
