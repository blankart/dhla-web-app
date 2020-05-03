import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarSetSubmissionDeadline } from '../../../src/features/app/RegistrarSetSubmissionDeadline';

describe('app/RegistrarSetSubmissionDeadline', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarSetSubmissionDeadline {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-set-submission-deadline').length
    ).toBe(1);
  });
});
