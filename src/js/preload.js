var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Languid;
(function (Languid) {
    var Preload = (function (_super) {
        __extends(Preload, _super);
        function Preload() {
            _super.apply(this, arguments);
        }
        Preload.prototype.preload = function () {
            this.preloadBar = this.game.add.sprite(200, 250, 'preloadBar');
            this.game.load.setPreloadSprite(this.preloadBar);

            this.game.load.audio('guileTheme', 'src/js/assets/Mitch Murder - Guile\'s Theme.mp3', true);
        };

        Preload.prototype.create = function () {
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.launchGame, this);
        };

        Preload.prototype.launchGame = function () {
            this.game.state.start("Staging");
        };
        return Preload;
    })(Phaser.State);
    Languid.Preload = Preload;
})(Languid || (Languid = {}));
