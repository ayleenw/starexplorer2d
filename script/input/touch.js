import Vector from '../lib/vector.js';
import TouchState from './touchstate.js';
import { MIN_SWIPE_DISTANCE } from '../globalconst.js';

export default class TouchHandler {
  constructor() {
    this.firstFinger = new TouchState();
    this.secondFinger = new TouchState();
    this.position = new Vector();
    this.fingers = [];
  }

  reset() {
    this.firstFinger.pressed = false;
    this.secondFinger.pressed = false;
  }

  handleTouchMove(touches) {
    for (let t of touches) {
      let f = this.fingers[t.identifier];
      let x = t.pageX;
      let y = t.pageY;

      this.position = new Vector(x, y);

      this.firstFinger.lastSwipe = this.detectSwipe(
        new Vector(
          this.firstFinger.startPositionDown.x - this.position.x,
          this.firstFinger.startPositionDown.y - this.position.y
        )
      );

      this.secondFinger.lastSwipe = this.detectSwipe(
        new Vector(
          this.secondFinger.startPositionDown.x - this.position.x,
          this.secondFinger.startPositionDown.y - this.position.y
        )
      );
    }
  }

  handleTouchStart(touches) {
    this.handleTouchMove(touches);

    for (let t of touches) {
      if (t.identifier === 0) {
        if (!this.firstFinger.down) {
          this.firstFinger.pressed = true;
          this.firstFinger.startPositionDown = this.position;
        }
        this.firstFinger.down = true;
      } else if (t.identifier === 1) {
        if (!this.secondFinger.down) {
          this.secondFinger.pressed = true;
          this.secondFinger.startPositionDown = this.position;
        }
        this.secondFinger.down = true;
      }
    }
  }

  handleTouchEnd(touches) {
    this.handleTouchMove(touches);

    for (let t of touches) {
      this.fingers[t.identifier] = undefined;
      if (t.identifier === 0) {
        this.firstFinger.down = false;
        this.firstFinger.endPositionDown = this.position;
      } else if (t.identifier === 1) {
        this.secondFinger.down = false;
        this.secondFinger.endPositionDown = this.position;
      }
    }
  }

  detectSwipe(diff) {
    this.action = null;

    if (Math.abs(diff.x) > Math.abs(diff.y)) {
      if (diff.x > MIN_SWIPE_DISTANCE) {
        this.action = 'left';
      } else {
        this.action = 'right';
      }
    } else {
      if (diff.y > MIN_SWIPE_DISTANCE) {
        this.action = 'up';
      } else {
        this.action = 'down';
      }
    }

    return this.action;
  }
}
