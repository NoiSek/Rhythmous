var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Languid;
(function (Languid) {
    var spawnedCircle = (function () {
        function spawnedCircle(x, y, radius, decayTime, decaySpeed) {
            if (typeof radius === "undefined") { radius = 32; }
            if (typeof decayTime === "undefined") { decayTime = 2; }
            if (typeof decaySpeed === "undefined") { decaySpeed = 1; }
            this.radius = radius;
            this.decayTime = decayTime;
            this.decaySpeed = decaySpeed;
            this.position = { "x": 0, "y": 0 };
            this.active = true;
            this.position.x = x;
            this.position.y = y;

            this.decayAmount = 0.5 * this.decaySpeed;
        }
        spawnedCircle.prototype.step = function () {
            if (this.radius - this.decayAmount > 0) {
                this.radius = this.radius - this.decayAmount;
            } else {
                this.active = false;
            }

            return this.active;
        };
        return spawnedCircle;
    })();

    var Staging = (function (_super) {
        __extends(Staging, _super);
        function Staging() {
            _super.apply(this, arguments);
            this.circlesList = [];
        }
        Staging.prototype.preload = function () {
        };

        Staging.prototype.create = function () {
            this.mousePosition = this.game.input.position;
            this.backgroundMusic = this.game.add.audio('guileTheme', 0.3, true);

            this.game.input.onDown.add(this.addCircle, this);

            this.baseCircleShape = this.game.add.bitmapData(64, 64);
            this.baseCircleShape.ctx.beginPath();
            this.baseCircleShape.ctx.arc(32, 32, 32, 0, 2 * Math.PI, false);
            this.baseCircleShape.ctx.fillStyle = '#fff';
            this.baseCircleShape.ctx.fill();
        };

        Staging.prototype.update = function () {
            this.spamCircles();
            this.updateCircles();
        };

        Staging.prototype.addCircle = function (x, y) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof x == 'object') {
                x = this.mousePosition.x - 32;
                y = this.mousePosition.y - 32;
            }

            var newCircleContainer = new spawnedCircle(x, y);
            var newCircleShape = this.game.add.sprite(x, y, this.baseCircleShape);
            newCircleShape.tint = Math.random() * 0xffffff;
            newCircleShape.alpha = Math.random();

            this.circlesList.push({ "container": newCircleContainer, "shape": newCircleShape, "recycle": false });
        };

        Staging.prototype.updateCircles = function () {
            if (this.circlesList.length > 0) {
                for (var key in this.circlesList) {
                    if (this.circlesList[key].container.step()) {
                        this.circlesList[key].shape.x = this.circlesList[key].shape.x + this.circlesList[key].container.decayAmount;
                        this.circlesList[key].shape.y = this.circlesList[key].shape.y + this.circlesList[key].container.decayAmount;

                        this.circlesList[key].shape.width = this.circlesList[key].container.radius * 2;
                        this.circlesList[key].shape.height = this.circlesList[key].container.radius * 2;
                    } else {
                        this.circlesList[key].shape.destroy();
                        this.circlesList[key].recycle = true;
                    }
                }

                this.circlesList = this.circlesList.filter(function (circle) {
                    return circle.recycle == false;
                });
            }
        };

        Staging.prototype.spamCircles = function () {
            var getRandom = function (min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            };
            if (Math.random() >= 0.7) {
                this.addCircle(getRandom(0, this.game.stage.width), getRandom(0, this.game.stage.height));
            }
        };
        return Staging;
    })(Phaser.State);
    Languid.Staging = Staging;
})(Languid || (Languid = {}));
