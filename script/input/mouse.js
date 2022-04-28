import Vector from '../lib/vector.js';
import MouseState from './mousestate.js';

export default class MouseHandler {
  constructor() {
    this.left = new MouseState();
    this.middle = new MouseState();
    this.right = new MouseState();

    this.position = new Vector();
  }

  reset() {
    this.left.pressed = false;
    this.middle.pressed = false;
    this.right.pressed = false;
  }

  handleMouseMove(event) {
    let x = event.pageX;
    let y = event.pageY;

    this.position = new Vector(x, y);
  }

  handleMouseDown(event) {
    this.handleMouseMove(event);

    if (event.which === 1) {
      if (!this.left.down) {
        this.left.pressed = true;
      }
      this.left.down = true;
    } else if (event.which === 2) {
      if (!this.middle.down) {
        this.middle.pressed = true;
      }
      this.middle.down = true;
    } else if (event.which === 3) {
      if (!this.right.down) {
        this.right.pressed = true;
      }
      this.right.down = true;
    }
  }

  handleMouseUp(event) {
    this.handleMouseMove(event);

    if (event.which === 1) {
      this.left.down = false;
    } else if (event.which === 2) {
      this.middle.down = false;
    } else if (event.which === 3) {
      this.right.down = false;
    }
  }
}
