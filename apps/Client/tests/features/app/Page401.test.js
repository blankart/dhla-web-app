import React from 'react';
import { shallow } from 'enzyme';
import { Page401 } from '../../../src/features/app';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Page401 />);
  expect(renderedComponent.find('.app-page-401').length).toBe(1);
});
