import React from 'react';
import { shallow } from 'enzyme';
import { StudentTooltip } from '../../../src/features/app/StudentTooltip';

describe('app/StudentTooltip', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <StudentTooltip {...props} />
    );

    expect(
      renderedComponent.find('.app-student-tooltip').length
    ).toBe(1);
  });
});
