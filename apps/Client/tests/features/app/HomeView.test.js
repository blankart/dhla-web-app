import React from 'react';
import { shallow } from 'enzyme';
import { HomeView } from '../../../src/features/app/HomeView';

describe('app/HomeView', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(<HomeView {...props} />);

    expect(renderedComponent.find('.app-home-view').length).toBe(1);
  });
});
