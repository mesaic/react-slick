import React from 'react';
import makeResponsiveComponent from './makeResponsiveComponent';
import {mount} from 'enzyme';

describe('makeResponsiveComponent', () => {
  it('works', () => {
    const Component = () => <div>foo</div>;
    const ResponsiveComponent = makeResponsiveComponent(Component, {defaultProps: {foo: 'bar'}});
    const wrapper = mount(<ResponsiveComponent />);
    console.info('[makeResponsiveComponent.test.js] wrapper.props(): ', wrapper.props())
    // console.info('[makeResponsiveComponent.test.js] wrapper.props(): ', wrapper.props());
  })
})
