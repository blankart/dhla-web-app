import React from 'react';
import { shallow } from 'enzyme';
import { TeacherSummaryView } from '../../../src/features/app/TeacherSummaryView';

describe('app/TeacherSummaryView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <TeacherSummaryView {...props} />
    );

    expect(
      renderedComponent.find('.app-teacher-summary-view').length
    ).toBe(1);
  });
});
