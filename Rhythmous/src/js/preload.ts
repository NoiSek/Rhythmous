module Languid {

  export class Preload extends Phaser.State {

    preloadBar: Phaser.Sprite;

    preload() {
      //  Set-up our preloader sprite
      this.preloadBar = this.game.add.sprite(this.game.world.centerX - 200, this.game.world.centerY - 20, 'preloadBar');
      this.game.load.setPreloadSprite(this.preloadBar);

      //  Load assets
      this.game.load.audio('guileTheme', 'src/js/assets/Mitch Murder - Guile\'s Theme.mp3', true);
      this.game.load.audio('randomSound', 'src/js/assets/Randomize2.wav', true);
      this.game.load.audio('soundtrack1', 'src/js/assets/Project_Divinity_-_Temporal.mp3', true);
      this.game.load.audio('soundtrack2', 'src/js/assets/Project_Divinity_-_Simulacrum.mp3', true);
      this.game.load.audio('soundtrack3', 'src/js/assets/Project_Divinity_-_Trios.mp3', true);
      
    }

    create() {
      var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
      tween.onComplete.add(this.launchGame, this);
    }

    launchGame() {
      this.game.state.start("Staging");
    }
  }
}