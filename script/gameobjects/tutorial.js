import {
  MAXPOINTS,
  WINDOWHEIGH,
  WINDOWWIDTH,
  TOP_BAR_HEIGHT,
  TOP_BAR_FONT,
  OUTER,
} from '../globalconst.js';

export default class Tutorial {
  constructor(context, colorBg, colorTxt) {
    this.context = context;
    this.lines = [];
    this.x = OUTER;
    this.y = TOP_BAR_HEIGHT * 1.15;
    this.width = WINDOWWIDTH - 2 * OUTER;
    this.heigth = (WINDOWHEIGH / 2) * 1.2;
    this.colorBg = colorBg;
    this.colorTxt = colorTxt;
    this.screen = 0;
    this.text();
  }

  text() {
    this.lines = [
      [
        '[Tutorial 1/3] Your task:',
        ' ',
        'Explore the 3 sectors in your range and colonize them by placing',
        'settlers (checkers) onto the sectors (platforms). You have 4 nations',
        '(= checkers in 4 colors), but only 3 sectors. The enemy will also place',
        'his settlers (dark gray checkers) and thus takes away space from you.',
        ' ',
        'Settlers can also be moved from sector to sector.',
        'Set and move your checkers strategically to win!',
        ' ',
        'The game begins with empty playgrounds (levels).',
        'You have the first move, you and the enemy move alternating.',
      ],
      [
        '[Tutorial 2/3] Moving:',
        '',
        'Checkers will appear in random color order. Place them on an',
        'empty field on any level. Drag checkers to the desired target field.',
        'The border of a free field will light up in green color. Drop the checker',
        'to place it. The enemy will place its checkers randomly.',
        'Although you should try to fill a platform with one',
        'color, you are allowed to place mixed color checkers',
        'on one platform. Instead of placing a new checker,',
        'you can decide to move one existing checker to another',
        'platform. In this case, the computer must also move',
        'a checker instead of placing a new one.',
      ],
      [
        '[Tutorial 3/3] Accounting:',
        ' ',
        'When all fields on a platform have been filled, it will',
        'be evaluated who has won the platform. The enemys checkers',
        'are counted and compared with the players checkers.',
        'If the player has placed several colors on this level,',
        'the color with the most checkers counts.',
        'In case of a tie, the score is in favor of the player. ',
        "This somewhat compensates for the computer's advantage ",
        'of playing with only one color. The platform winner gets one',
        'point. The platform will be cleared and can be used again.',
        'Winner: The game ends when one participant reaches ' +
          MAXPOINTS +
          ' points.',
      ],
    ];
  }

  create() {
    this.context.fillStyle = this.colorBg;
    this.context.fillRect(this.x, this.y, this.width, this.heigth);
    this.context.fillStyle = this.colorTxt;
    this.context.font = TOP_BAR_FONT;
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    for (let i = 0; i < this.lines[this.screen].length; ++i) {
      this.context.fillText(
        this.lines[this.screen][i],
        WINDOWWIDTH / 2,
        WINDOWHEIGH / 5 + i * 33
      );
    }
  }
}
