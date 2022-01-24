import React from 'react';
import { shallow } from 'enzyme';
import { TeacherSummary } from '../../../src/features/app/TeacherSummary';

describe('app/TeacherSummary', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <TeacherSummary {...props} />
    );

    expect(
      renderedComponent.find('.app-teacher-summary').length
    ).toBe(1);
  });
});
