import React from 'react';
import { shallow } from 'enzyme';
import { TeacherEditRecordView } from '../../../src/features/app/TeacherEditRecordView';

describe('app/TeacherEditRecordView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <TeacherEditRecordView {...props} />
    );

    expect(
      renderedComponent.find('.app-teacher-edit-record-view').length
    ).toBe(1);
  });
});
