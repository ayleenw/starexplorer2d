export default class Assets {
  constructor() {
    this.sprites = {};
    this.assetsLoading = 0;
  }
  assetsLoadLoop(callback) {
    if (assetsLoading) {
      requestAnimationFrame(assetsLoadLoop.bind(this, callback));
    } else {
      callback();
    }
  }

  loadAssets(callback) {
    function loadSprite(fileName) {
      assetsLoading++;

      let spriteImage = new Image();
      spriteImage.src = './assets/graphics/' + fileName;

      spriteImage.onload = function () {
        assetsLoading--;
      };
      return spriteImage;
    }

    this.sprites.background = loadSprite('sky.png');
    this.sprites.background_test = loadSprite('billard_bg.png');

    assetsLoadLoop(callback);
  }
}
