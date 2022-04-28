import {
  PLAYGROUNDSIZE,
  LINEWIDTH,
  PLATFORMCOLORS,
  MIN_SNAP_DISTANCE,
  HOVER_STROKE_OK,
  COLORS,
} from '../globalconst.js';
import Vector from '../lib/vector.js';

export default class Platform {
  constructor(context, position, pno) {
    this.context = context;
    this.position = position;
    this.pno = pno;
    this.singleField = PLAYGROUNDSIZE / 3;
    this.fields = [];
    this.fieldposition = [];
  }

  create() {
    let count = 0;
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        let xPos = x * this.singleField + this.position.x;
        let yPos = y * this.singleField + this.position.y;
        this.fields.push(null);
        this.fieldposition.push(
          new Vector(xPos + this.singleField / 2, yPos + this.singleField / 2)
        );
        count++;
      }
    }
  }

  draw() {
    let count = 0;
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        if (count % 2 === 0) {
          this.context.fillStyle = PLATFORMCOLORS[0];
        } else {
          this.context.fillStyle = PLATFORMCOLORS[1];
        }
        this.context.fillRect(
          this.fieldposition[count].x - this.singleField / 2,
          this.fieldposition[count].y - this.singleField / 2,
          this.singleField,
          this.singleField
        );
        count++;
      }
    }
    this.context.strokeStyle = PLATFORMCOLORS[0];
    this.context.lineWidth = LINEWIDTH;
    this.context.strokeRect(
      this.position.x,
      this.position.y,
      PLAYGROUNDSIZE,
      PLAYGROUNDSIZE
    );
  }

  getChecker(index) {
    return this.fields[index];
  }

  getCheckers() {
    let myCheckers = [];
    for (let i = 0; i < this.fields.length; i++) {
      if (this.fields[i] !== null) {
        myCheckers.push(this.fields[i]);
      }
    }
    return myCheckers;
  }

  drawCheckers() {
    for (let i = 0; i < this.fields.length; i++) {
      if (this.fields[i] !== null) {
        this.fields[i].draw();
      }
    }
  }

  isFull() {
    for (let i = 0; i < this.fields.length; i++) {
      if (this.fields[i] === null) return false;
    }
    return true;
  }

  hasWon(callback) {
    let enemyCount = 0;
    let max = 0;
    for (let i = 0; i < this.fields.length; i++) {
      if (this.fields[i].color === Object.keys(COLORS)[4]) {
        enemyCount++;
      }
      if (enemyCount >= 5) {
        callback.computerWinsPlatform();
        return;
      }
    }

    let count;
    for (let c = 0; c < 4; c++) {
      count = 0;
      for (let i = 0; i < this.fields.length; i++) {
        if (this.fields[i].color === Object.keys(COLORS)[c]) {
          count++;
        }
      }
      if (count > max) {
        max = count;
      }
    }
    if (max >= enemyCount) {
      callback.playerWinsPlatform();
    } else {
      callback.computerWinsPlatform();
    }
  }

  hoverOverField(position) {
    let actualFieldPosition;
    let actualField;

    let count = 0;
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        let distance = new Vector(
          this.fieldposition[count].x - position.x,
          this.fieldposition[count].y - position.y
        ).vlength();

        if (distance < MIN_SNAP_DISTANCE) {
          actualFieldPosition = this.getFieldPosition(count);
          actualField = count;
        }
        count++;
      }
    }
    return { actualFieldPosition, actualField };
  }

  highlightField(index) {
    this.context.strokeStyle = HOVER_STROKE_OK;
    this.context.lineWidth = LINEWIDTH;
    if (this.fieldposition[index] != undefined) {
      this.context.strokeRect(
        this.fieldposition[index].x - this.singleField / 2,
        this.fieldposition[index].y - this.singleField / 2,
        this.singleField,
        this.singleField
      );
    }
  }

  fieldFree(index) {
    if (this.fields[index] === null) {
      return true;
    } else {
      return false;
    }
  }

  putOnField(checker, index) {
    this.fields[index] = checker;
  }

  removeFromField(index) {
    this.fields[index] = null;
  }

  enemyOnPlatform() {
    for (let i = 0; i < this.fields.length; i++) {
      if (this.fields[i] !== null && this.fields[i].color === 'gray') {
        return i;
      }
    }
    return -1;
  }

  clear() {
    for (let i = 0; i < this.fields.length; i++) {
      this.fields[i] = null;
    }
  }

  getFieldPosition(field) {
    return new Vector(this.fieldposition[field].x, this.fieldposition[field].y);
  }

  isOver(position) {
    if (
      position.y > this.position.y &&
      position.y < this.position.y + PLAYGROUNDSIZE
    ) {
      if (
        position.x > this.position.x &&
        position.x < this.position.x + PLAYGROUNDSIZE
      ) {
        return true;
      }
    } else {
      return false;
    }
  }
}
