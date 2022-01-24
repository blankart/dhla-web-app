import React from 'react';
import { shallow } from 'enzyme';
import { RegistrarViewSubjectLoadView } from '../../../src/features/app/RegistrarViewSubjectLoadView';

describe('app/RegistrarViewSubjectLoadView', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RegistrarViewSubjectLoadView {...props} />
    );

    expect(
      renderedComponent.find('.app-registrar-view-subject-load-view').length
    ).toBe(1);
  });
});
