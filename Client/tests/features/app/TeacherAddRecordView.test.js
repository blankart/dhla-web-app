import React from 'react';
import { shallow } from 'enzyme';
import { TeacherAddRecordView } from '../../../src/features/app/TeacherAddRecordView';

describe('app/TeacherAddRecordView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <TeacherAddRecordView {...props} />
    );

    expect(
      renderedComponent.find('.app-teacher-add-record-view').length
    ).toBe(1);
  });
});
