import React from 'react';
import { shallow } from 'enzyme';
import { TeacherComponentView } from '../../../src/features/app/TeacherComponentView';

describe('app/TeacherComponentView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <TeacherComponentView {...props} />
    );

    expect(
      renderedComponent.find('.app-teacher-component-view').length
    ).toBe(1);
  });
});
