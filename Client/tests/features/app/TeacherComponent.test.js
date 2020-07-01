import React from 'react';
import { shallow } from 'enzyme';
import { TeacherComponent } from '../../../src/features/app/TeacherComponent';

describe('app/TeacherComponent', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <TeacherComponent {...props} />
    );

    expect(
      renderedComponent.find('.app-teacher-component').length
    ).toBe(1);
  });
});
