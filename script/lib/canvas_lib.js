function item(context) {
  let x = 0,
    y = 0,
    alpha = 0,
    scale = 1;
  let children = [];

  let matrix = new DOMMatrix();
  let needUpdate = false;

  let obj_infos = {};
  let touchID;

  function append(c) {
    children.push(c);
  }

  function getMatrix() {
    update();
    return matrix;
  }
  function isTouched(pointer, identifier) {
    let movingMatrix = pointer.getMatrix();

    let localInverse = DOMMatrix.fromMatrix(matrix);
    localInverse.invertSelf(); // Inverse der lokalen Matrix

    let localTouchPoint = localInverse.transformPoint(
      new DOMPoint(movingMatrix.e, movingMatrix.f)
    );
    if (
      context.isPointInPath(
        obj_infos.path,
        localTouchPoint.x,
        localTouchPoint.y
      )
    ) {
      touchID = identifier;
      return true;
    }
    return false;
  }

  function isClicked(pointer) {
    let movingMatrix = pointer.getMatrix();

    let localInverse = DOMMatrix.fromMatrix(matrix);
    localInverse.invertSelf();

    let localClickPoint = localInverse.transformPoint(
      new DOMPoint(movingMatrix.e, movingMatrix.f)
    );
    if (
      context.isPointInPath(
        obj_infos.path,
        localClickPoint.x,
        localClickPoint.y
      )
    ) {
      return true;
    }
    return false;
  }

  function update() {
    if (needUpdate) {
      matrix = new DOMMatrix();
      matrix.translateSelf(x, y);
      matrix.rotateSelf(alpha);
      matrix.scaleSelf(scale);
    }
  }

  function move(newX, newY) {
    x = newX;
    y = newY;
    needUpdate = true;
  }

  function rotate(newAlpha) {
    alpha = newAlpha;
    needUpdate = true;
  }

  function setScale(sc) {
    scale = sc;
    needUpdate = true;
  }

  function draw(parent) {
    update();

    let local = DOMMatrix.fromMatrix(parent);
    local.multiplySelf(matrix);

    for (let c of children) {
      context.save();
      c.draw(local);
      context.restore();
    }
    context.setTransform(local);
  }

  return {
    move,
    rotate,
    getMatrix,
    draw,
    isClicked,
    isTouched,
    append,
    setScale,
    obj_infos,
  };
}

function rect_path(width, height) {
  let rpath = new Path2D();
  rpath.moveTo(-width / 2, -height / 2);
  rpath.lineTo(width / 2, -height / 2);
  rpath.lineTo(width / 2, height / 2);
  rpath.lineTo(-width / 2, height / 2);
  rpath.lineTo(-width / 2, -height / 2);
  rpath.closePath();
  return rpath;
}

export function rect(context, width, height, id, fillStyle) {
  let o = item(context);
  o.obj_infos.path = rect_path(width, height);
  o.obj_infos.fillStyle = fillStyle;
  o.obj_infos.id = id;
  let pre = o.draw;
  o.draw = function (m) {
    pre(m);

    context.fillStyle = o.obj_infos.fillStyle;
    context.fill(o.obj_infos.path);
    context.resetTransform();
  };

  return o;
}

export function circle(context, radius, fillStyle, text = 'Circle') {
  let o = item(context);
  let pre = o.draw;
  o.draw = function (parent) {
    pre(parent);

    context.fillStyle = fillStyle;
    let endAngle = Math.PI * 2;
    context.beginPath();
    context.arc(0, 0, radius, 0, endAngle, true);
    context.fill();

    context.fillStyle = '#fff';
    context.fillText(text, 0, 0);

    context.resetTransform();
  };

  return o;
}

function roundRect_path(width, height, radius) {
  let rrpath = new Path2D();
  rrpath.moveTo(radius, 0);
  rrpath.lineTo(width - radius, 0);
  rrpath.quadraticCurveTo(width, 0, width, radius);
  rrpath.lineTo(width, height - radius);
  rrpath.quadraticCurveTo(width, height, width - radius, height);
  rrpath.lineTo(radius, height);
  rrpath.quadraticCurveTo(0, height, 0, height - radius);
  rrpath.lineTo(0, radius);
  rrpath.quadraticCurveTo(0, 0, radius, 0);
  rrpath.closePath();
  return rrpath;
}

export function roundedRect(context, width, height, radius, fillStyle) {
  let o = item(context);
  o.obj_infos.path = roundRect_path(width, height, radius);
  o.obj_infos.fillStyle = fillStyle;
  let pre = o.draw;
  o.draw = function (m) {
    pre(m);

    context.fillStyle = o.obj_infos.fillStyle;
    context.fill(o.obj_infos.path);
    context.resetTransform();
  };

  return o;
}

function line_path(oldX, oldY, x, y, stroke, fillStyle) {
  let lpath = new Path2D();
  lpath.moveTo(oldX, oldY);
  lpath.lineTo(x, y);
  lpath.closePath();
  return lpath;
}
export function line(context, oldX, oldY, x, y, stroke, fillStyle) {
  let o = item(context);
  o.obj_infos.path = line_path(oldX, oldY, x, y, stroke, fillStyle);
  o.obj_infos.fillStyle = fillStyle;
  let pre = o.draw;
  o.draw = function (m) {
    pre(m);

    context.lineWidth = stroke;
    context.strokeStyle = o.obj_infos.fillStyle;
    context.stroke(o.obj_infos.path);
    context.resetTransform();
  };

  return o;
}
