// Graphic attributes
export const TOP_BAR_COLOR = '#98AFC7';
export const TOP_BAR_FONT = '24px Verdana';
export const BUTTON_FONT_SIZE = '24px Verdana';
export const COLORS = {
  blue: '#1F45FC',
  red: '#E42217',
  green: '#41A317',
  yellow: '#FFD801',
  gray: '#34282C', // enemy
};
export const PLATFORMCOLORS = [TOP_BAR_COLOR, '#fff'];
export const HOVER_STROKE_OK = 'green';
export const HOVER_STROKE_NOK = 'red';

// Sizes
export const PLATFORMS = 3;
export const WINDOWWIDTH = 1200;
export const WINDOWHEIGH = 700;
export const PLAYGROUNDSIZE = 300;

export const UPPER = 150;
export const OUTER = 50;
export const BETWEEN = (WINDOWWIDTH - 3 * PLAYGROUNDSIZE - 2 * OUTER) / 2;

export const LINEWIDTH = 3;
export const TOP_BAR_HEIGHT = 100;
export const CHECKER_RADIUS = PLAYGROUNDSIZE / 6;
export const BUTTONWIDTH = 200;
export const BUTTONHEIGHT = 100;

// State
export const GAMESTATE = {
  INTRO: 0,
  PLAYER: 1,
  COMPUTER: 2,
  GAMEOVER: 3,
};

// Game mechanics
export const MIN_SWIPE_DISTANCE = 10;
export const MIN_SNAP_DISTANCE = 40;
export const MAXPOINTS = 10;
