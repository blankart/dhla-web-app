import React from 'react';
import { shallow } from 'enzyme';
import { Page404 } from '../../../src/features/app';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Page404 />);
  expect(renderedComponent.find('.app-page-404').length).toBe(1);
});
