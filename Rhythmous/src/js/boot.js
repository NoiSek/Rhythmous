var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Languid;
(function (Languid) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
            this.game.load.image('preloadBar', 'src/js/assets/loader.png');
        };

        Boot.prototype.create = function () {
            this.game.input.maxPointers = 1;

            this.game.stage.disableVisibilityChange = true;

            if (this.game.device.desktop) {
            } else {
            }

            this.game.state.start('Preload');
        };
        return Boot;
    })(Phaser.State);
    Languid.Boot = Boot;
})(Languid || (Languid = {}));
