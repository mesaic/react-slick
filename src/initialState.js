export default {
  animating: false,
  dragging: false,
  autoPlayTimer: null,
  currentDirection: 0,
  currentLeft: null,
  currentSlide: 0,
  direction: 1,
  slideCount: null,
  slideWidth: null,
  swipeLeft: null,
  touchObject: {
    startX: 0,
    startY: 0,
    curX: 0,
    curY: 0,
  },

  lazyLoadedList: [],

    // added for react
  initialized: false,
  edgeDragged: false,
  swiped: false, // used by swipeEvent. differentites between touch and swipe.
  trackStyle: {},
  trackWidth: 0,
};
