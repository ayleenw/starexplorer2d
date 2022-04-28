import { BUTTONWIDTH, BUTTONHEIGHT, BUTTON_FONT_SIZE } from '../globalconst.js';

export default class Button {
  constructor(ctx, x, y, colorBtn, colorTxt, text) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.width = BUTTONWIDTH;
    this.height = BUTTONHEIGHT;
    this.colorBtn = colorBtn;
    this.colorTxt = colorTxt;
    this.text = text;
    this.click = false;
    // this.drawButton();
  }

  drawButton(text) {
    this.ctx.fillStyle = this.colorBtn;
    this.ctx.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    this.ctx.fillStyle = this.colorTxt;
    this.ctx.font = BUTTON_FONT_SIZE;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, this.x, this.y);
  }

  clicked(position, pressed) {
    if (this.isInside(position) && pressed) {
      this.click = true;
      return true;
    } else {
      return false;
    }
  }

  isInside(position) {
    let dx = Math.abs(position.x - this.x);
    let dy = Math.abs(position.y - this.y);
    let btnXhalf = this.width / 2;
    let btnYhalf = this.height / 2;
    if (dx < btnXhalf && dy < btnYhalf) {
      return true;
    } else {
      return false;
    }
  }
}
