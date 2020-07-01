import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarViewStudentRecordSectionView } from '../../../src/features/app/RegistrarViewStudentRecordSectionView';

describe('app/RegistrarViewStudentRecordSectionView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarViewStudentRecordSectionView {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-view-student-record-section-view').length
    ).toBe(1);
  });
});
