import React from 'react';
import makeResponsiveComponent from './makeResponsiveComponent';
import {mount} from 'enzyme';

describe('makeResponsiveComponent', () => {
  it('works', () => {
    const Component = () => <div>foo</div>;
    /* eslint-disable */
    const ResponsiveComponent = makeResponsiveComponent(Component, {defaultProps: {foo: 'bar'}});
    const wrapper = mount(<ResponsiveComponent />);
    /* eslint-enable */
  });
});
