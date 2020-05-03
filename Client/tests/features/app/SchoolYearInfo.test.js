import React from 'react';
import { shallow } from 'enzyme';
import { SchoolYearInfo } from '../../../src/features/app/SchoolYearInfo';

describe('app/SchoolYearInfo', () => {
  it('renders node with correct class name', () => {
    const props = {
      app: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <SchoolYearInfo {...props} />
    );

    expect(
      renderedComponent.find('.app-school-year-info').length
    ).toBe(1);
  });
});
