export default class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  copy() {
    return new Vector(this.x, this.y);
  }

  addTo(v) {
    if (v.constructor === Vector) {
      this.x += v.x;
      this.y += v.y;
    } else if (v.constructor === Number) {
      this.x += v;
      this.y += v;
    }
    return this;
  }

  add(v) {
    var result = this.copy();
    return result.addTo(v);
  }

  subtract(vec) {
    return new Vector(this.x - vec.x, this.y - vec.y);
  }

  multiply(factor) {
    return new Vector(this.x * factor, this.y * factor);
  }

  dot(vec) {
    return this.x * vec.x + this.y * vec.y;
  }

  vlength() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
}
