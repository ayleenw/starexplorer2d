import Button from './input/button.js';
import {
  OUTER,
  BUTTONWIDTH,
  BUTTONHEIGHT,
  TOP_BAR_COLOR,
  WINDOWWIDTH,
  TOP_BAR_HEIGHT,
  TOP_BAR_FONT,
  GAMESTATE,
  WINDOWHEIGH,
} from './globalconst.js';
import Tutorial from './gameobjects/tutorial.js';

export default class GUI {
  constructor(context, canvas) {
    this.context = context;
    this.canvas = canvas;
    this.startButtonText = '';

    this.startButton = new Button(
      this.context,
      OUTER + BUTTONWIDTH / 2,
      canvas.getSize().y - BUTTONHEIGHT,
      '#0000A0',
      'white',
      'Start Game'
    );
    this.continueButton = new Button(
      this.context,
      BUTTONWIDTH * 2,
      canvas.getSize().y - BUTTONHEIGHT,
      '#848482',
      'white',
      'Continue'
    );
    this.tutorial = new Tutorial(this.context, '#6D7B8D', '#151B54');
  }

  pressStart(actionPos, actionState, callback) {
    if (this.startButton.clicked(actionPos, actionState)) {
      callback.start();
    }
  }

  pressNext(actionPos, actionState, callback) {
    if (this.startButton.clicked(actionPos, actionState)) {
      this.tutorial.screen += 1;
    }
  }

  pressContinue(actionPos, actionState, callback) {
    if (this.continueButton.clicked(actionPos, actionState)) {
      callback.resume();
    }
  }

  topBar(computerCount, playerCount) {
    this.context.fillStyle = TOP_BAR_COLOR;
    this.context.fillRect(0, 0, WINDOWWIDTH, TOP_BAR_HEIGHT);
    this.context.fillStyle = 'black';
    this.context.font = TOP_BAR_FONT;
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillText(
      'Computer: ' + computerCount,
      WINDOWWIDTH / 7,
      TOP_BAR_HEIGHT / 2
    );
    this.context.fillText(
      'Player: ' + playerCount,
      (WINDOWWIDTH / 7) * 6,
      TOP_BAR_HEIGHT / 2
    );
  }

  draw(computerCount, playerCount, gameState) {
    this.topBar(computerCount, playerCount);
    if (gameState === GAMESTATE.INTRO) {
      this.tutorial.create();
      if (this.tutorial.screen < 2) {
        this.startButtonText = 'Next >>>';
      } else {
        this.startButtonText = 'Start Game';
      }
    }
    if (gameState === GAMESTATE.GAMEOVER || gameState === GAMESTATE.INTRO) {
      this.startButton.drawButton(this.startButtonText);
    }
  }

  drawPausedScreen(pwinner, pno) {
    this.overlay(pwinner + ' platform ' + ++pno);
    this.continueButton.drawButton('Continue');
  }

  gameOver(winner) {
    this.overlay('Game over! ' + winner);
  }

  overlay(text) {
    this.context.fillStyle = 'rgba(0,0,0,0.5)';
    this.context.fillRect(0, 0, WINDOWWIDTH, WINDOWHEIGH - BUTTONHEIGHT * 2);
    this.context.fillStyle = 'white';
    this.context.font = TOP_BAR_FONT;
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillText(text, WINDOWWIDTH / 2, TOP_BAR_HEIGHT / 2);
  }
}
