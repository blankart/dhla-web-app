import React from 'react';
import { shallow } from 'enzyme';
import { TeacherAddRecord } from '../../../src/features/app/TeacherAddRecord';

describe('app/TeacherAddRecord', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <TeacherAddRecord {...props} />
    );

    expect(
      renderedComponent.find('.app-teacher-add-record').length
    ).toBe(1);
  });
});
