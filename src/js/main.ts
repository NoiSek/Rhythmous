module Languid {

  export class Game extends Phaser.Game {

    constructor() {

      super("100", "100", Phaser.AUTO, 'content', null);

      this.state.add('Boot', Boot, false);
      this.state.add('Preload', Preload, false);
      this.state.add('Staging', Staging, false);

      this.state.start('Boot');

    }

  }

}
