import React from 'react';
import { shallow } from 'enzyme';
import { TeacherSubcomponentView } from '../../../src/features/app/TeacherSubcomponentView';

describe('app/TeacherSubcomponentView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <TeacherSubcomponentView {...props} />
    );

    expect(
      renderedComponent.find('.app-teacher-subcomponent-view').length
    ).toBe(1);
  });
});
