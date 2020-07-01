import React from 'react';
import { shallow } from 'enzyme';
import { TeacherEditRecord } from '../../../src/features/app/TeacherEditRecord';

describe('app/TeacherEditRecord', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <TeacherEditRecord {...props} />
    );

    expect(
      renderedComponent.find('.app-teacher-edit-record').length
    ).toBe(1);
  });
});
