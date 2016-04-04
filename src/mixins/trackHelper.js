import ReactDOM from 'react-dom';

export const getTrackCSS = (spec) => {
  let trackWidth;

  if (spec.variableWidth) {
    trackWidth = (spec.slideCount + 2 * spec.slidesToShow) * spec.slideWidth;
  } else if (spec.centerMode) {
    trackWidth = (spec.slideCount + 2 * (spec.slidesToShow + 1)) * spec.slideWidth;
  } else {
    trackWidth = (spec.slideCount + 2 * spec.slidesToShow) * spec.slideWidth;
  }

  const transformStyle = `translate3d(${spec.left}px, 0px, 0px)`;
  const style = {
    opacity: 1,
    width: trackWidth,
    WebkitTransform: transformStyle,
    transform: transformStyle,
    WebkitTransition: transformStyle,
    transition: '',
    msTransform: `translateX(${spec.left}px`,
  };

  // Fallback for IE8
  if (!window.addEventListener && window.attachEvent) {
    style.marginLeft = `${spec.left}px`;
  }

  return style;
};

export const getTrackAnimateCSS = (spec) => {
  const style = getTrackCSS(spec);
  // useCSS is true by default so it can be undefined
  style.WebkitTransition = `-webkit-transform ${spec.speed}ms ${spec.cssEase}`;
  style.transition = `transform ${spec.speed}ms ${spec.cssEase}`;
  return style;
};

export const getTrackLeft = (spec) => {
  let slideOffset = 0;
  let targetLeft;
  let targetSlide;

  if (spec.fade) {
    return 0;
  }

  if (spec.infinite) {
    if (spec.slideCount > spec.slidesToShow) {
      slideOffset = (spec.slideWidth * spec.slidesToShow) * -1;
    }
    if (spec.slideCount % spec.slidesToScroll !== 0) {
      if (spec.slideIndex + spec.slidesToScroll > spec.slideCount && spec.slideCount > spec.slidesToShow) {
        if (spec.slideIndex > spec.slideCount) {
          slideOffset = ((spec.slidesToShow - (spec.slideIndex - spec.slideCount)) * spec.slideWidth) * -1;
        } else {
          slideOffset = ((spec.slideCount % spec.slidesToScroll) * spec.slideWidth) * -1;
        }
      }
    }
  }

  if (spec.centerMode) {
    if (spec.infinite) {
      slideOffset += spec.slideWidth * Math.floor(spec.slidesToShow / 2);
    } else {
      slideOffset = spec.slideWidth * Math.floor(spec.slidesToShow / 2);
    }
  }

  targetLeft = ((spec.slideIndex * spec.slideWidth) * -1) + slideOffset;

  if (spec.variableWidth === true) {
    let targetSlideIndex;
    if (spec.slideCount <= spec.slidesToShow || spec.infinite === false) {
      targetSlide = ReactDOM.findDOMNode(spec.trackRef).childNodes[spec.slideIndex];
    } else {
      targetSlideIndex = (spec.slideIndex + spec.slidesToShow);
      targetSlide = ReactDOM.findDOMNode(spec.trackRef).childNodes[targetSlideIndex];
    }
    targetLeft = targetSlide ? targetSlide.offsetLeft * -1 : 0;
    if (spec.centerMode === true) {
      if (spec.infinite === false) {
        targetSlide = ReactDOM.findDOMNode(spec.trackRef).children[spec.slideIndex];
      } else {
        targetSlide = ReactDOM.findDOMNode(spec.trackRef).children[(spec.slideIndex + spec.slidesToShow + 1)];
      }

      targetLeft = targetSlide ? targetSlide.offsetLeft * -1 : 0;
      targetLeft += (spec.listWidth - targetSlide.offsetWidth) / 2;
    }
  }

  return targetLeft;
};
