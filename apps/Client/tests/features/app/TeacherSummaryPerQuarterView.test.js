import React from 'react';
import { shallow } from 'enzyme';
import { TeacherSummaryPerQuarterView } from '../../../src/features/app/TeacherSummaryPerQuarterView';

describe('app/TeacherSummaryPerQuarterView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <TeacherSummaryPerQuarterView {...props} />
    );

    expect(
      renderedComponent.find('.app-teacher-summary-per-quarter-view').length
    ).toBe(1);
  });
});
