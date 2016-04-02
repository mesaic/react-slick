import React, {Component, PropTypes} from 'react';
import assign from 'object-assign';
import classnames from 'classnames';

const getSlideClasses = (spec) => {
  let slickActive;
  let slickCenter;
  let centerOffset;
  let index;

  if (spec.rtl) {
    index = spec.slideCount - 1 - spec.index;
  } else {
    index = spec.index;
  }

  const slickCloned = (index < 0) || (index >= spec.slideCount);
  if (spec.centerMode) {
    centerOffset = Math.floor(spec.slidesToShow / 2);
    slickCenter = (index - spec.currentSlide) % spec.slideCount === 0;
    if (
      (index > spec.currentSlide - centerOffset - 1) &&
      (index <= spec.currentSlide + centerOffset)
    ) {
      slickActive = true;
    }
  } else {
    slickActive = (spec.currentSlide <= index) && (index < spec.currentSlide + spec.slidesToShow);
  }
  return classnames({
    'slick-slide': true,
    'slick-active': slickActive,
    'slick-center': slickCenter,
    'slick-cloned': slickCloned,
  });
};

const getSlideStyle = (spec) => {
  const style = {};

  if (spec.variableWidth === undefined || spec.variableWidth === false) {
    style.width = spec.slideWidth;
  }

  if (spec.fade) {
    style.position = 'relative';
    style.left = -spec.index * spec.slideWidth;
    style.opacity = (spec.currentSlide === spec.index) ? 1 : 0;
    const transition = `opacity ${spec.speed}ms ${spec.cssEase}`;
    style.transition = transition;
    style.WebkitTransition = transition;
  }

  return style;
};

const renderSlides = (spec) => {
  let key;
  const slides = [];
  const preCloneSlides = [];
  const postCloneSlides = [];
  const count = React.Children.count(spec.children);
  let child;

  React.Children.forEach(spec.children, (elem, index) => {
    if (!spec.lazyLoad | (spec.lazyLoad && spec.lazyLoadedList.indexOf(index) >= 0)) {
      child = elem;
    } else {
      child = (<div></div>);
    }
    const childStyle = getSlideStyle({...spec, index});
    const slickClasses = getSlideClasses({...spec, index});
    let cssClasses;

    if (child.props.className) {
      cssClasses = classnames(slickClasses, child.props.className);
    } else {
      cssClasses = slickClasses;
    }

    slides.push(React.cloneElement(child, {
      key: index,
      'data-index': index,
      className: cssClasses,
      style: assign({}, child.props.style || {}, childStyle),
    }));

    // variableWidth doesn't wrap properly.
    if (spec.infinite && spec.fade === false) {
      const infiniteCount = spec.variableWidth ? spec.slidesToShow + 1 : spec.slidesToShow;

      if (index >= (count - infiniteCount)) {
        key = -(count - index);
        preCloneSlides.push(React.cloneElement(child, {
          key,
          'data-index': key,
          className: cssClasses,
          style: assign({}, child.props.style || {}, childStyle),
        }));
      }

      if (index < infiniteCount) {
        key = count + index;
        postCloneSlides.push(React.cloneElement(child, {
          key,
          'data-index': key,
          className: cssClasses,
          style: assign({}, child.props.style || {}, childStyle),
        }));
      }
    }
  });

  if (spec.rtl) {
    return preCloneSlides.concat(slides, postCloneSlides).reverse();
  } else {
    return preCloneSlides.concat(slides, postCloneSlides);
  }
};

export default class Track extends Component {
  static propTypes = {
    trackStyle: PropTypes.object,
  };

  render() {
    const slides = renderSlides(this.props);
    return (
      <div className='slick-track' style={this.props.trackStyle}>
        {slides}
      </div>
    );
  }
}
