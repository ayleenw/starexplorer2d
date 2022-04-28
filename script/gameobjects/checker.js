import { CHECKER_RADIUS, COLORS } from '../globalconst.js';
import Vector from '../lib/vector.js';

export default class Checker {
  constructor(context, color) {
    this.context = context;
    this.color = color;
    this.position = new Vector();
  }

  draw() {
    this.context.fillStyle = COLORS[this.color];
    let endAngle = Math.PI * 2;
    this.context.beginPath();
    this.context.arc(
      this.position.x,
      this.position.y,
      CHECKER_RADIUS,
      0,
      endAngle,
      true
    );
    this.context.fill();
  }

  move(newPos) {
    this.position = newPos;
  }

  isInside(position) {
    let dx = position.x - this.position.x;
    let dy = position.y - this.position.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < CHECKER_RADIUS) {
      return true;
    } else {
      return false;
    }
  }
}
