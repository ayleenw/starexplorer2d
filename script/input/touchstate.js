import Vector from '../lib/vector.js';

export default class TouchState {
  constructor() {
    this.down = false;
    this.pressed = false;
    this.startPositionDown = new Vector();
    this.endPositionDown = new Vector();
    this.lastSwipe = null;
  }
}
