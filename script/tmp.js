next() {
    // Check if a platform is full and evaluate winner
    for (let p = 0; p < PLATFORMS; p++) {
      if (this.platforms[p].isFull()) {
        this.platforms[p].hasWon(this);
        this.paused = true;
        this.platformToClear = p;
        // this.platforms[p].clear();
      }
      this.gameIsOver();
    }
    if (this.gameState === GAMESTATE.GAMEOVER) {
      let winner = this.whoIsWinner();
      // console.log(winner);
    }
    this.rebuildCheckerArray();
    // console.log('Checkers.array.length: ' + this.checkers.length);

    ///////////////////////////////////////////////
    // Player move
    if (this.gameState === GAMESTATE.PLAYER) {
      this.playerLock = 0;
      this.playerFinished = false;

      let rand = getRandomInt(0, 3); // number of colors for player = 4
      let color = Object.keys(COLORS)[rand];
      this.actualChecker = new Checker(this.context, color);
      this.checkers.push(this.actualChecker);
      this.actualChecker.move(
        new Vector(
          this.canvas.getSize().x - BUTTONHEIGHT,
          this.canvas.getSize().y - BUTTONHEIGHT
        )
      );
    }
    if (this.gameState === GAMESTATE.COMPUTER) {
      ///////////////////////////////////////////////
      // Enemy (= Computer) moves existing checker randomly
      let enemyPutToPlatform = getRandomInt(0, PLATFORMS - 1);
      let enemyPutToField;
      let enemyTakeFromPlatform;
      let enemyTakeFromField;

      if (this.playerLock === 2) {
        // check if enemy on randomly selected platform to take away
        do {
          enemyTakeFromPlatform = getRandomInt(0, PLATFORMS - 1);
          enemyTakeFromField =
            this.platforms[enemyTakeFromPlatform].enemyOnPlatform();
        } while (enemyTakeFromField === -1);

        if (enemyTakeFromPlatform === 0 || enemyTakeFromPlatform === 2) {
          enemyPutToPlatform = 1;
        } else {
          let rand = getRandomAddSubtractOne();
          enemyPutToPlatform = enemyTakeFromPlatform + rand;
        }
        this.platforms[enemyTakeFromPlatform].removeFromField(
          enemyTakeFromField
        );
      }

      // Target in both cases:
      do {
        enemyPutToField = getRandomInt(0, 8);
      } while (!this.platforms[enemyPutToPlatform].fieldFree(enemyPutToField));

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

      this.gameState = GAMESTATE.PLAYER;
      this.next();
    }
  }


  update() {
    if (
      this.gameState === GAMESTATE.PLAYER &&
      !this.paused &&
      !this.playerFinished
    ) {
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
              if (!this.newCheckerTaken) {
                this.newCheckerTaken = true;
                this.playerLock = 1;
                break;
              }
            } else {
              if (!this.checkerRemoved) {
                this.checkers.length = this.checkers.length - 1;
                // Grabbed existing checker
                for (let p = 0; p < PLATFORMS; p++) {
                  if (this.platforms[p].isOver(this.mouse.position)) {
                    this.actualPlatform = p;
                    this.actualField = this.platforms[p].hoverOverField(
                      this.mouse.position
                    ).actualField;
                    this.platforms[this.actualPlatform].removeFromField(
                      this.actualField
                    );
                    this.checkerRemoved = true;
                    break;
                  }
                }
                this.playerLock = 2;
              }
            }
          }
        }
      }

      // Move checker
      if (this.grabbed && this.mouse.left.down) {
        this.actualChecker.move(this.mouse.position);
      }

      // Let checker go
      if (this.grabbed && !this.mouse.left.down) {
        // If over a platform
        if (this.actualPlatform !== null) {
          if (this.platforms[this.actualPlatform].fieldFree(this.actualField)) {
            this.platforms[this.actualPlatform].putOnField(
              this.actualChecker,
              this.actualField
            );
          }
          // Snap checker to field center
          this.actualChecker.move(this.actualFieldPosition);
          this.checkerRemoved = false;
          this.newCheckerTaken = false;
          this.playerFinished = true;
          this.gameState = GAMESTATE.COMPUTER;
        } else {
          this.newCheckerTaken = false;
          this.checkerRemoved = false;
        }

        this.grabbed = false;
      }
    }
    this.gui.pressStart(this.mouse.position, this.mouse.left.pressed, this);
    if (this.paused) {
      this.gui.pressContinue(
        this.mouse.position,
        this.mouse.left.pressed,
        this
      );
    }
    this.actualPlatform = null;
    this.actualFieldPosition = null;
    if (!this.paused) {
      if (this.playerFinished) this.next();
    }
  }




