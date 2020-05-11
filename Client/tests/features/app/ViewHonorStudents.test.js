import React from 'react';
import { shallow } from 'enzyme';
import { ViewHonorStudents } from '../../../src/features/app/ViewHonorStudents';

describe('app/ViewHonorStudents', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <ViewHonorStudents {...props} />
    );

    expect(
      renderedComponent.find('.app-view-honor-students').length
    ).toBe(1);
  });
});
