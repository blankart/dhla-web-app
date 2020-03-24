import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarEditSubjectLoadView } from '../../../src/features/app/RegistrarEditSubjectLoadView';

describe('app/RegistrarEditSubjectLoadView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarEditSubjectLoadView {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-edit-subject-load-view').length
    ).toBe(1);
  });
});
