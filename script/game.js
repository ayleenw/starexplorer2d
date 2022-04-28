// 'use strict';
import Canvas2D from './canvas2d.js';
import Universe from './universe.js';
import MouseHandler from './input/mouse.js';
import TouchHandler from './input/touch.js';

let canvas;
let context;
let universe;
let mouse;
let touch;

function init() {
  mouse = new MouseHandler();
  touch = new TouchHandler();
  canvas = new Canvas2D('myCanvas', mouse, touch);
  context = canvas.context;
  universe = new Universe(context, canvas, mouse, touch);

  window.requestAnimationFrame(gameLoop);
}

function gameLoop() {
  canvas.clear();
  universe.update();
  universe.draw();
  mouse.reset();
  touch.reset();

  window.requestAnimationFrame(gameLoop);
}

window.onload = init;
