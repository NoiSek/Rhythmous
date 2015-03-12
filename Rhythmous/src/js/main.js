var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Languid;
(function (Languid) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, "100", "100", Phaser.AUTO, 'content', null);

            this.state.add('Boot', Languid.Boot, false);
            this.state.add('Preload', Languid.Preload, false);
            this.state.add('Staging', Languid.Staging, false);

            this.state.start('Boot');
        }
        return Game;
    })(Phaser.Game);
    Languid.Game = Game;
})(Languid || (Languid = {}));
