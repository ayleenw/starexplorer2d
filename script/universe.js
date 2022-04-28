import Checker from './gameobjects/checker.js';
import {
  PLATFORMS,
  UPPER,
  OUTER,
  BETWEEN,
  GAMESTATE,
  BUTTONHEIGHT,
  PLAYGROUNDSIZE,
  COLORS,
  MAXPOINTS,
} from './globalconst.js';
import GUI from './GUI.js';
import Vector from './lib/vector.js';
import { getRandomInt } from './lib/gamelogic.js';
import Platform from './gameobjects/platform.js';

export default class Universe {
  constructor(context, canvas, mouse, touch) {
    this.context = context;
    this.canvas = canvas;
    this.mouse = mouse;
    this.touch = touch;
    this.gui = new GUI(this.context, this.canvas);
    this.actualChecker = null;
    this.actualFieldPosition = new Vector();
    this.actualPlatform = null;
    this.actualField = null;
    this.platformToClear = null;
    this.checkers;
    this.platforms = [];
    this.grabbed = false;
    this.gameState = GAMESTATE.INTRO;
    this.computerCount = 0;
    this.playerCount = 0;
    this.checkerCreated = false;
    this.checkPlatforms = false;
    this.playerLock = 0; // 1 = new checker taken, -1: existing checker taken
    this.platformWinner = '';
    this.winner;

    this.paused = false;
    this.init();
  }

  init() {
    for (let i = 0; i < PLATFORMS; i++) {
      let platform = new Platform(
        this.context,
        new Vector(OUTER + i * (BETWEEN + PLAYGROUNDSIZE), UPPER),
        i
      );
      this.platforms.push(platform);
      platform.create();
    }
  }

  start() {
    if (
      this.gameState === GAMESTATE.INTRO ||
      this.gameState === GAMESTATE.GAMEOVER ||
      this.gameState === GAMESTATE.PLAYER
    ) {
      this.gameState = GAMESTATE.PLAYER;
      for (let i = 0; i < PLATFORMS; i++) {
        this.platforms[i].clear();
      }
      this.paused = false;
      this.computerCount = 0;
      this.playerCount = 0;
      this.checkers = [];
      this.playerLock = 0;
    }
  }

  update() {
    if (this.checkPlatforms) {
      this.countCheckersOnPlatform();
    }
    if (this.gameState !== GAMESTATE.GAMEOVER) {
      if (this.gameState === GAMESTATE.PLAYER) {
        if (!this.checkerCreated) {
          let rand = getRandomInt(0, 3); // number of colors for player = 4
          let color = Object.keys(COLORS)[rand];
          this.actualChecker = new Checker(this.context, color);
          this.checkers.push(this.actualChecker);
          this.actualChecker.move(
            new Vector(
              this.canvas.getSize().x / 2,
              this.canvas.getSize().y - BUTTONHEIGHT
            )
          );
          this.checkerCreated = true;
        }

        // Grab checker
        if (!this.grabbed) {
          for (let i = 0; i < this.checkers.length; i++) {
            if (
              this.checkers[i].color !== 'gray' &&
              this.checkers[i].isInside(this.mouse.position) &&
              this.mouse.left.down
            ) {
              this.grabbed = true;
              this.actualChecker = this.checkers[i];
              if (i === this.checkers.length - 1) {
                // Grabbed new checker
                if (this.playerLock === 0) {
                  this.playerLock = 1;
                  break;
                }
              } else {
                // Grabbed existing checker
                if (this.playerLock === 0) {
                  // Remove last created checker
                  if (this.checkerCreated) {
                    this.checkers.length = this.checkers.length - 1;
                  }
                  for (let p = 0; p < PLATFORMS; p++) {
                    if (this.platforms[p].isOver(this.mouse.position)) {
                      this.actualPlatform = p;
                      this.actualField = this.platforms[p].hoverOverField(
                        this.mouse.position
                      ).actualField;
                      this.platforms[this.actualPlatform].removeFromField(
                        this.actualField
                      );
                      break;
                    }
                  }
                  this.playerLock = -1;
                }
              }
            }
          } // end for loop through checkers array
        } // closes: if(!this.grabbed)

        // Move checker
        if (this.grabbed && this.mouse.left.down) {
          this.actualChecker.move(this.mouse.position);
          // Is platform field that is hovered with mouse / checker free?
          for (let j = 0; j < PLATFORMS; j++) {
            if (this.platforms[j].isOver(this.mouse.position)) {
              let pf = this.platforms[j].hoverOverField(this.mouse.position);
              this.actualField = pf.actualField;
              if (this.platforms[j].fieldFree(this.actualField)) {
                this.actualFieldPosition = pf.actualFieldPosition;
                this.actualPlatform = j;
                break;
              }
            } else {
              this.actualPlatform = null;
              this.actualField = null;
            }
          }
        }

        // Let checker go
        if (this.grabbed && !this.mouse.left.down) {
          // If over a platform
          if (this.actualPlatform !== null) {
            if (
              this.platforms[this.actualPlatform].fieldFree(this.actualField)
            ) {
              this.platforms[this.actualPlatform].putOnField(
                this.actualChecker,
                this.actualField
              );
            }
            // Snap checker to field center
            this.actualChecker.move(this.actualFieldPosition);
            this.actualPlatform = null;
            this.actualField = null;
            this.checkPlatforms = true;
            this.gameState = GAMESTATE.COMPUTER;
          }
          this.grabbed = false;
        } // end: let checker go
      } // closes: if(this.gameState === GAMESTATE.PLAYER)

      if (this.gameState === GAMESTATE.COMPUTER) {
        // Enemy (= Computer) moves existing checker randomly
        let enemyPutToPlatform;
        let enemyPutToField;
        let enemyTakeFromPlatform;
        let enemyTakeFromField;

        do {
          enemyPutToPlatform = getRandomInt(0, PLATFORMS - 1);
        } while (this.platforms[enemyPutToPlatform].isFull());

        if (this.playerLock === -1) {
          // check if enemy available on randomly selected platform to take away
          do {
            enemyTakeFromPlatform = getRandomInt(0, PLATFORMS - 1);
            enemyTakeFromField =
              this.platforms[enemyTakeFromPlatform].enemyOnPlatform();
          } while (enemyTakeFromField === -1);

          this.platforms[enemyTakeFromPlatform].removeFromField(
            enemyTakeFromField
          );
        }

        // Target in both cases:
        do {
          enemyPutToField = getRandomInt(0, 8);
        } while (
          !this.platforms[enemyPutToPlatform].fieldFree(enemyPutToField)
        );

        // Enemy (= Computer) sets new checker randomly
        this.actualChecker = new Checker(this.context, Object.keys(COLORS)[4]);

        this.checkers.push(this.actualChecker);
        this.actualChecker.move(
          this.platforms[enemyPutToPlatform].getFieldPosition(enemyPutToField)
        );
        this.platforms[enemyPutToPlatform].putOnField(
          this.actualChecker,
          enemyPutToField
        );

        this.playerLock = 0;
        this.checkerCreated = false;
        this.actualPlatform = null;
        this.actualField = null;
        this.checkPlatforms = true;
        this.gameState = GAMESTATE.PLAYER;
      } // closes: if(this.gameState === GAMESTATE.COMPUTER)

      if (this.paused) {
        this.gui.pressContinue(
          this.mouse.position,
          this.mouse.left.pressed,
          this
        );
      }
    } // closes: if(!this.gameState === GAMESTATE.GAMEOVER)

    if (
      this.gameState === GAMESTATE.GAMEOVER ||
      this.gameState === GAMESTATE.INTRO
    ) {
      if (this.gui.tutorial.screen < 2) {
        this.gui.pressNext(this.mouse.position, this.mouse.left.pressed, this);
      } else {
        this.gui.pressStart(this.mouse.position, this.mouse.left.pressed, this);
      }
    }
  }

  draw() {
    this.gui.draw(this.computerCount, this.playerCount, this.gameState);

    if (this.gameState !== GAMESTATE.INTRO) {
      for (let i = 0; i < PLATFORMS; i++) {
        this.platforms[i].draw();
        this.platforms[i].drawCheckers();
      }
      if (this.actualChecker !== null) this.actualChecker.draw();
    }

    if (this.actualPlatform !== null) {
      this.platforms[this.actualPlatform].highlightField(this.actualField);
    }

    if (this.gameState === GAMESTATE.GAMEOVER) {
      this.gui.startButtonText = 'New Game';
      this.winner = this.whoIsWinner();
      this.gui.gameOver(this.winner);
    }

    if (this.paused && this.gameState !== GAMESTATE.GAMEOVER) {
      this.gui.drawPausedScreen(this.platformWinner, this.platformToClear);
    }
  }

  playerWinsPlatform() {
    this.playerCount++;
    this.platformWinner = 'You win';
  }

  computerWinsPlatform() {
    this.computerCount++;
    this.platformWinner = 'Enemy wins';
  }

  isGameOver() {
    if (this.playerCount >= MAXPOINTS || this.computerCount >= MAXPOINTS) {
      this.gameState = GAMESTATE.GAMEOVER;
      this.paused = false;
    }
  }

  whoIsWinner() {
    let winner = '';
    if (this.playerCount >= MAXPOINTS) winner = 'You win!!!';
    if (this.computerCount >= MAXPOINTS) winner = 'You loose :(';
    return winner;
  }

  countCheckersOnPlatform() {
    for (let p = 0; p < PLATFORMS; p++) {
      if (this.platforms[p].isFull()) {
        this.platforms[p].hasWon(this);
        this.paused = true;
        this.platformToClear = p;
        this.isGameOver();
      }
    }
    this.checkPlatforms = false;
  }

  resume() {
    this.platforms[this.platformToClear].clear();
    this.paused = false;
  }
}
