import React from 'react';
import { shallow } from 'enzyme';
import { SampleComponent } from '../../../src/features/app/SampleComponent';

describe('app/SampleComponent', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <SampleComponent {...props} />
    );

    expect(
      renderedComponent.find('.app-sample-component').length
    ).toBe(1);
  });
});
