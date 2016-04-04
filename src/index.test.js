import React from 'react';
import {mount} from 'enzyme';
import {Slider} from './index';
// import pretty from 'prettify-xml';

const sliderProps = {
  infinite: false,
};

// const p = (wrapper) => pretty(wrapper.html());

const makeSlider = (props) => <Slider {...sliderProps} {...props}>
  <div>Slide 1 </div>
  <div>Slide 2 </div>
  <div>Slide 3 </div>
</Slider>;

describe('index', () => {
  it('renders', () => {
    const responsive = [
      {breakpoint: 768, settings: {slidesToShow: 3}},
      {breakpoint: 1024, settings: {slidesToShow: 5}},
      {breakpoint: 100000, settings: 'unslick'},
    ];
    const wrapper = mount(makeSlider({responsive}));
    // console.info('[index.test.js] html', prettifyXml(wrapper.html()));
    const state = wrapper.state();
    console.info('[index.test.js] state: ', state);
    // console.info('[index.test.js] wrapper.state(): ', wrapper.state())
  });
});
