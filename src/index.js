import React, {PropTypes} from 'react';
import assign from 'object-assign';
import json2mq from 'json2mq';
import ResponsiveMixin from 'react-responsive-mixin';

import defaultProps from './defaultProps';
import InnerSlider from './InnerSlider';

const Slider = React.createClass({ // eslint-disable-line react/prefer-es6-class
  mixins: [ResponsiveMixin], // eslint-disable-line react/sort-comp
  propTypes: {
    responsive: PropTypes.any,
    children: PropTypes.node,
  },
  getInitialState() {
    return {
      breakpoint: null,
    };
  },
  componentDidMount() {
    if (this.props.responsive) {
      const breakpoints = this.props.responsive.map((breakpoint) => (breakpoint.breakpoint));
      breakpoints.sort((x, y) => x - y);

      breakpoints.forEach((breakpoint, index) => {
        let bQuery;
        if (index === 0) {
          bQuery = json2mq({minWidth: 0, maxWidth: breakpoint});
        } else {
          bQuery = json2mq({minWidth: breakpoints[index - 1], maxWidth: breakpoint});
        }
        this.media(bQuery, () => {
          this.setState({breakpoint});
        });
      });

      // Register media query for full screen. Need to support resize from small to large
      const query = json2mq({minWidth: breakpoints.slice(-1)[0]});

      this.media(query, () => {
        this.setState({breakpoint: null});
      });
    }
  },

  render() {
    let settings;
    let newProps;
    if (this.state.breakpoint) {
      newProps = this.props.responsive.filter((resp) => resp.breakpoint === this.state.breakpoint);
      settings = newProps[0].settings === 'unslick'
        ? 'unslick'
        : assign({}, this.props, newProps[0].settings);
    } else {
      settings = assign({}, defaultProps, this.props);
    }
    if (settings === 'unslick') {
      // if 'unslick' responsive breakpoint setting used, just return the <Slider> tag nested HTML
      return (
        <div>{this.props.children}</div>
      );
    } else {
      return (
        <InnerSlider {...settings}>
          {this.props.children}
        </InnerSlider>
      );
    }
  },
});

export default Slider;
