import Vector from './lib/vector.js';
import Assets from './assets.js';
import { WINDOWWIDTH, WINDOWHEIGH } from './globalconst.js';

export default class Canvas2D {
  constructor(id, mouse, touch) {
    this.canvas = document.getElementById(id);
    this.context = this.canvas.getContext('2d');
    this.context.canvas.width = WINDOWWIDTH || window.innerWidth;
    this.context.canvas.height = WINDOWHEIGH || window.innerHeight;
    this.mouse = mouse;
    this.touch = touch;

    // //////////////////// Touch
    this.canvas.addEventListener(
      'touchstart',
      (event) => {
        event.preventDefault();
        this.touch.handleTouchStart(event.changedTouches);
      },
      true
    );

    this.canvas.addEventListener(
      'touchmove',
      (event) => {
        event.preventDefault();
        this.touch.handleTouchMove(event.changedTouches);
      },
      true
    );

    this.canvas.addEventListener(
      'touchend',
      (event) => {
        event.preventDefault();
        this.touch.handleTouchEnd(event.changedTouches);
      },
      true
    );

    // //////////////////// Mouse
    this.canvas.addEventListener(
      'mousedown',
      (event) => {
        event.preventDefault();
        this.mouse.handleMouseDown(event);
      },
      false
    );
    this.canvas.addEventListener(
      'mousemove',
      (event) => {
        event.preventDefault();
        this.mouse.handleMouseMove(event);
      },
      false
    );
    this.canvas.addEventListener(
      'mouseup',
      (event) => {
        event.preventDefault();
        this.mouse.handleMouseUp(event);
      },
      false
    );
    this.canvas.addEventListener(
      'contextmenu',
      (event) => {
        event.preventDefault();
        this.mouse.handleMouseDown(event);
      },
      false
    );
  }

  getSize() {
    return new Vector(this.canvas.width, this.canvas.height);
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawBackground() {
    let sprites = new Assets().sprites;
    this.drawImage(sprites.background);
  }

  drawImage(image, position, origin) {
    if (!position) {
      position = new Vector();
    }

    if (!origin) {
      origin = new Vector();
    }

    this.context.save();
    this.context.translate(position.x, position.y);
    this.context.drawImage(image, -origin.x, -origin.y);
    this.context.restore();
  }
}
