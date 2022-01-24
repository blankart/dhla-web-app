import React from 'react';
import { shallow } from 'enzyme';
import { TeacherSubcomponent } from '../../../src/features/app/TeacherSubcomponent';

describe('app/TeacherSubcomponent', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <TeacherSubcomponent {...props} />
    );

    expect(
      renderedComponent.find('.app-teacher-subcomponent').length
    ).toBe(1);
  });
});
