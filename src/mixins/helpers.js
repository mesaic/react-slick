import React from 'react';
import ReactDOM from 'react-dom';
import ReactTransitionEvents from 'react/lib/ReactTransitionEvents';

import {getTrackCSS, getTrackLeft, getTrackAnimateCSS} from './trackHelper';
import assign from 'object-assign';

const helpers = {
  initialize(props) {
    const slideCount = React.Children.count(props.children);
    const listWidth = this.getWidth(ReactDOM.findDOMNode(this.refs.list));
    const trackWidth = this.getWidth(ReactDOM.findDOMNode(this.refs.track));
    const slideWidth = this.getWidth(ReactDOM.findDOMNode(this)) / props.slidesToShow;

    const currentSlide = props.rtl ? slideCount - 1 - props.initialSlide : props.initialSlide;

    this.setState({
      slideCount,
      slideWidth,
      listWidth,
      trackWidth,
      currentSlide,
    }, () => {
      const targetLeft = getTrackLeft(assign({
        slideIndex: this.state.currentSlide,
        trackRef: this.refs.track,
      }, props, this.state));
      // getCSS function needs previously set state
      const trackStyle = getTrackCSS(assign({left: targetLeft}, props, this.state));

      this.setState({trackStyle});

      this.autoPlay(); // once we're set up, trigger the initial autoplay.
    });
  },

  update(props) {
    // This method has mostly same code as initialize method.
    // Refactor it
    const slideCount = React.Children.count(props.children);
    const listWidth = this.getWidth(ReactDOM.findDOMNode(this.refs.list));
    const trackWidth = this.getWidth(ReactDOM.findDOMNode(this.refs.track));
    const slideWidth = this.getWidth(ReactDOM.findDOMNode(this)) / props.slidesToShow;

    this.setState({
      slideCount,
      slideWidth,
      listWidth,
      trackWidth,
    }, () => {
      const targetLeft = getTrackLeft(assign({
        slideIndex: this.state.currentSlide,
        trackRef: this.refs.track,
      }, props, this.state));
      // getCSS function needs previously set state
      const trackStyle = getTrackCSS(assign({left: targetLeft}, props, this.state));

      this.setState({trackStyle});
    });
  },
  getWidth: function getWidth(elem) {
    return elem.getBoundingClientRect().width || elem.offsetWidth;
  },

  adaptHeight() {
    if (this.props.adaptiveHeight) {
      const selector = `[data-index="${this.state.currentSlide}"]`;
      if (this.refs.list) {
        const slickList = ReactDOM.findDOMNode(this.refs.list);
        slickList.style.height = `${slickList.querySelector(selector).offsetHeight}px`;
      }
    }
  },

  slideHandler(index) {
    // Functionality of animateSlide and postSlide is merged into this function
    // console.log('slideHandler', index);
    let targetSlide;
    let currentSlide;
    let targetLeft;
    let callback;

    if (this.props.waitForAnimate && this.state.animating) {
      return;
    }

    if (this.props.fade) {
      currentSlide = this.state.currentSlide;

      //  Shifting targetSlide back into the range
      if (index < 0) {
        targetSlide = index + this.state.slideCount;
      } else if (index >= this.state.slideCount) {
        targetSlide = index - this.state.slideCount;
      } else {
        targetSlide = index;
      }

      if (this.props.lazyLoad && this.state.lazyLoadedList.indexOf(targetSlide) < 0) {
        this.setState({
          lazyLoadedList: this.state.lazyLoadedList.concat(targetSlide),
        });
      }

      callback = () => {
        this.setState({animating: false});
        if (this.props.afterChange) {
          this.props.afterChange(currentSlide);
        }
        ReactTransitionEvents.removeEndEventListener(
          ReactDOM.findDOMNode(this.refs.track).children[currentSlide], callback);
      };

      this.setState({animating: true, currentSlide: targetSlide}, () => {
        ReactTransitionEvents.addEndEventListener(
          ReactDOM.findDOMNode(this.refs.track).children[currentSlide], callback);
      });

      if (this.props.beforeChange) {
        this.props.beforeChange(this.state.currentSlide, currentSlide);
      }

      this.autoPlay();
      return;
    }

    targetSlide = index;
    if (targetSlide < 0) {
      if (this.props.infinite === false) {
        currentSlide = 0;
      } else if (this.state.slideCount % this.props.slidesToScroll !== 0) {
        currentSlide = this.state.slideCount - (this.state.slideCount % this.props.slidesToScroll);
      } else {
        currentSlide = this.state.slideCount + targetSlide;
      }
    } else if (targetSlide >= this.state.slideCount) {
      if (this.props.infinite === false) {
        currentSlide = this.state.slideCount - this.props.slidesToShow;
      } else if (this.state.slideCount % this.props.slidesToScroll !== 0) {
        currentSlide = 0;
      } else {
        currentSlide = targetSlide - this.state.slideCount;
      }
    } else {
      currentSlide = targetSlide;
    }

    targetLeft = getTrackLeft(assign({
      slideIndex: targetSlide,
      trackRef: this.refs.track,
    }, this.props, this.state));

    const currentLeft = getTrackLeft(assign({
      slideIndex: currentSlide,
      trackRef: this.refs.track,
    }, this.props, this.state));

    if (this.props.infinite === false) {
      targetLeft = currentLeft;
    }

    if (this.props.beforeChange) {
      this.props.beforeChange(this.state.currentSlide, currentSlide);
    }

    if (this.props.lazyLoad) {
      let loaded = true;
      const slidesToLoad = [];
      for (let i = targetSlide; i < targetSlide + this.props.slidesToShow; i++) {
        loaded = loaded && (this.state.lazyLoadedList.indexOf(i) >= 0);
        if (!loaded) {
          slidesToLoad.push(i);
        }
      }
      if (!loaded) {
        this.setState({
          lazyLoadedList: this.state.lazyLoadedList.concat(slidesToLoad),
        });
      }
    }

    // Slide Transition happens here.
    // animated transition happens to target Slide and
    // non - animated transition happens to current Slide
    // If CSS transitions are false, directly go the current slide.

    if (this.props.useCSS === false) {
      this.setState({
        currentSlide,
        trackStyle: getTrackCSS(assign({left: currentLeft}, this.props, this.state)),
      }, () => {
        if (this.props.afterChange) {
          this.props.afterChange(currentSlide);
        }
      });
    } else {
      const nextStateChanges = {
        animating: false,
        currentSlide,
        trackStyle: getTrackCSS(assign({left: currentLeft}, this.props, this.state)),
        swipeLeft: null,
      };

      callback = () => {
        this.setState(nextStateChanges);
        if (this.props.afterChange) {
          this.props.afterChange(currentSlide);
        }
        ReactTransitionEvents.removeEndEventListener(ReactDOM.findDOMNode(this.refs.track), callback);
      };

      this.setState({
        animating: true,
        currentSlide,
        trackStyle: getTrackAnimateCSS(assign({left: targetLeft}, this.props, this.state)),
      }, () => {
        ReactTransitionEvents.addEndEventListener(ReactDOM.findDOMNode(this.refs.track), callback);
      });
    }

    if (!this.state.autoPlayTimer) {
      this.autoPlay();
    }
  },

  swipeDirection(touchObject) {
    const xDist = touchObject.startX - touchObject.curX;
    const yDist = touchObject.startY - touchObject.curY;
    const r = Math.atan2(yDist, xDist);

    let swipeAngle = Math.round(r * 180 / Math.PI);
    if (swipeAngle < 0) {
      swipeAngle = 360 - Math.abs(swipeAngle);
    }
    if ((swipeAngle <= 45) && (swipeAngle >= 0) || (swipeAngle <= 360) && (swipeAngle >= 315)) {
      return (this.props.rtl === false ? 'left' : 'right');
    }
    if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
      return (this.props.rtl === false ? 'right' : 'left');
    }

    return 'vertical';
  },

  autoPlay() {
    const play = () => {
      if (this.state.mounted) {
        const nextIndex = this.props.rtl ?
        this.state.currentSlide - this.props.slidesToScroll :
        this.state.currentSlide + this.props.slidesToScroll;
        this.slideHandler(nextIndex);
      }
    };
    if (this.props.autoplay) {
      this.setState({
        autoPlayTimer: window.setInterval(play, this.props.autoplaySpeed),
      });
    }
  },

  pause() {
    if (this.state.autoPlayTimer) {
      window.clearInterval(this.state.autoPlayTimer);
    }
  },
};

export default helpers;
