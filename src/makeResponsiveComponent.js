import React, {PropTypes, Component} from 'react';
import assign from 'object-assign';
import json2mq from 'json2mq';
import canUseDom from 'can-use-dom';
const enquire = canUseDom && require('enquire.js');
import invariant from 'invariant';

/**
 * HOC that returns a component that takes a `responsive` array prop, defining
 * props under certain media query boundaries, merging them with a set of default props.
 */
export default function makeResponsiveComponent(component, {defaultProps} = {}) {
  return class Responsive extends Component {
    static propTypes = {
      responsive: PropTypes.array,
      children: PropTypes.node,
    };

    constructor(props) {
      super(props);
      this.state = {
        breakpoint: null,
      };
    }

    componentDidMount() {
      const {responsive} = this.props;
      if (responsive) {
        const breakpoints = responsive.map((breakpoint) => breakpoint.breakpoint);
        breakpoints.sort((x, y) => x - y);

        breakpoints.forEach((breakpoint, index) => {
          const mediaQuery = index === 0
            ? {minWidth: 0, maxWidth: breakpoint}
            : {minWidth: breakpoints[index - 1], maxWidth: breakpoint};

          this._registerMediaQueryHandler(json2mq(mediaQuery), () => {
            this.setState && this.setState({breakpoint});
          });
        });

        // Register media query for full screen. Need to support resize from small to large
        const query = json2mq({minWidth: breakpoints.slice(-1)[0]});

        this._registerMediaQueryHandler(query, () => {
          this.setState && this.setState({breakpoint: null});
        });
      }
    }

    componentWillUnmount() {
      if (this._mediaQueryHandlers) {
        this._mediaQueryHandlers.forEach((obj) => {
          enquire.unregister(obj.query, obj.handler);
        });
      }
    }

    render() {
      let settings;
      let newProps;
      const {breakpoint} = this.state;
      if (breakpoint) {
        newProps = this.props.responsive.filter((resp) => resp.breakpoint === this.state.breakpoint);
        settings = newProps[0].settings === 'unslick'
          ? 'unslick'
          : assign({}, this.props, newProps[0].settings);
      } else {
        settings = {...defaultProps, ...this.props};
      }
      if (settings === 'unslick') {
        // if 'unslick' responsive breakpoint setting used, just return the <Slider> tag nested HTML
        return <div>{this.props.children}</div>;
      } else {
        return React.createElement(component, settings, this.props.children);
      }
    }

    _registerMediaQueryHandler(mediaQueryString, handler) {
      invariant(typeof handler === 'function', '`handler` must be a function.');

      enquire.register(mediaQueryString, handler);
      if (!this._mediaQueryHandlers) {
        this._mediaQueryHandlers = [];
      }
      this._mediaQueryHandlers.push({query: mediaQueryString, handler: {match: handler}});
    }
  };
}
