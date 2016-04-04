import React, {PropTypes} from 'react';
import classnames from 'classnames';

import EventHandlersMixin from './mixins/event-handlers';
import HelpersMixin from './mixins/helpers';
import initialState from './initialState';
import defaultProps from './defaultProps';
import Track from './Track';
import makeResponsiveComponent from './makeResponsiveComponent';

export const Slider = React.createClass({ // eslint-disable-line react/prefer-es6-class
  mixins: [HelpersMixin, EventHandlersMixin], // eslint-disable-line react/sort-comp

  propTypes: {
    children: PropTypes.node,
    className: PropTypes.string,
    init: PropTypes.func,
    slidesToShow: PropTypes.number,
    lazyLoad: PropTypes.bool,
    variableWidth: PropTypes.bool,
    rtl: PropTypes.bool,
    fade: PropTypes.any,
    cssEase: PropTypes.any,
    speed: PropTypes.any,
    infinite: PropTypes.any,
    centerMode: PropTypes.any,
    slickGoTo: PropTypes.number,
    responsive: PropTypes.any,
  },

  getInitialState() {
    return initialState;
  },

  getDefaultProps() {
    return defaultProps;
  },

  componentWillMount() {
    if (this.props.init) {
      this.props.init();
    }
    this.setState({
      mounted: true,
    });
    const lazyLoadedList = [];
    for (let i = 0; i < React.Children.count(this.props.children); i++) {
      if (i >= this.state.currentSlide && i < this.state.currentSlide + this.props.slidesToShow) {
        lazyLoadedList.push(i);
      }
    }

    if (this.props.lazyLoad && this.state.lazyLoadedList.length === 0) {
      this.setState({lazyLoadedList});
    }
  },
  componentDidMount() {
    this.initialize(this.props);
    this.adaptHeight();
    if (window.addEventListener) {
      window.addEventListener('resize', this._handleWindowResize);
    } else {
      window.attachEvent('onresize', this._handleWindowResize);
    }
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.slickGoTo !== nextProps.slickGoTo) {
      this.changeSlide({
        message: 'index',
        index: nextProps.slickGoTo,
        currentSlide: this.state.currentSlide,
      });
    } else {
      this.update(nextProps);
    }
  },

  componentDidUpdate() {
    this.adaptHeight();
  },

  componentWillUnmount() {
    if (window.addEventListener) {
      window.removeEventListener('resize', this._handleWindowResize);
    } else {
      window.detachEvent('onresize', this._handleWindowResize);
    }
    if (this.state.autoPlayTimer) {
      window.clearInterval(this.state.autoPlayTimer);
    }
  },

  render() {
    const className = classnames('slick-initialized', 'slick-slider', this.props.className);

    const trackProps = {
      fade: this.props.fade,
      cssEase: this.props.cssEase,
      speed: this.props.speed,
      infinite: this.props.infinite,
      centerMode: this.props.centerMode,
      currentSlide: this.state.currentSlide,
      lazyLoad: this.props.lazyLoad,
      lazyLoadedList: this.state.lazyLoadedList,
      rtl: this.props.rtl,
      slideWidth: this.state.slideWidth,
      slidesToShow: this.props.slidesToShow,
      slideCount: this.state.slideCount,
      trackStyle: this.state.trackStyle,
      variableWidth: this.props.variableWidth,
    };
    return <div
      className={className}
      onMouseEnter={this.onInnerSliderEnter}
      onMouseLeave={this.onInnerSliderLeave}>
      <div
        ref='list'
        className='slick-list'
        onMouseDown={this.swipeStart}
        onMouseMove={this.state.dragging ? this.swipeMove : null}
        onMouseUp={this.swipeEnd}
        onMouseLeave={this.state.dragging ? this.swipeEnd : null}
        onTouchStart={this.swipeStart}
        onTouchMove={this.state.dragging ? this.swipeMove : null}
        onTouchEnd={this.swipeEnd}
        onTouchCancel={this.state.dragging ? this.swipeEnd : null}>
        <Track ref='track' {...trackProps}>
          {this.props.children}
        </Track>
      </div>
    </div>;
  },

  _handleWindowResize() {
    this.update(this.props);
  },
});

export default makeResponsiveComponent(Slider, {defaultProps});
