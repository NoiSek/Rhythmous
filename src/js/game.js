/// >reference path=”phaser.d.ts”/<
// This occurs before the game is loaded.
window.onload = function () {
    var game = new Languid.Game();
};
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
            //  Unless you specifically need to support multitouch I would recommend setting this to 1
            this.game.input.maxPointers = 1;

            //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
            this.game.stage.disableVisibilityChange = true;

            if (this.game.device.desktop) {
                //  If you have any desktop specific settings, they can go in here
                // this.stage.scale.pageAlignHorizontally = true;
            } else {
                //  Same goes for mobile settings.
            }

            this.game.state.start('Preload');
        };
        return Boot;
    })(Phaser.State);
    Languid.Boot = Boot;
})(Languid || (Languid = {}));
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
var Languid;
(function (Languid) {
    var Preload = (function (_super) {
        __extends(Preload, _super);
        function Preload() {
            _super.apply(this, arguments);
        }
        Preload.prototype.preload = function () {
            //  Set-up our preloader sprite
            this.preloadBar = this.game.add.sprite(this.game.world.centerX - 200, this.game.world.centerY - 20, 'preloadBar');
            this.game.load.setPreloadSprite(this.preloadBar);

            //  Load assets
            this.game.load.audio('guileTheme', 'src/js/assets/Mitch Murder - Guile\'s Theme.mp3', true);
            this.game.load.audio('randomSound', 'src/js/assets/Randomize2.wav', true);
            this.game.load.audio('soundtrack1', 'src/js/assets/Project_Divinity_-_Temporal.mp3', true);
            this.game.load.audio('soundtrack2', 'src/js/assets/Project_Divinity_-_Simulacrum.mp3', true);
            this.game.load.audio('soundtrack3', 'src/js/assets/Project_Divinity_-_Trios.mp3', true);
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
// Runs before the game starts, launches the game on window load
window.onload = function () {
    var game = new Languid.Game();
};
var Languid;
(function (Languid) {
    var spawnedCircle = (function (_super) {
        __extends(spawnedCircle, _super);
        function spawnedCircle(game, x, y, baseCircleShape, radius, decayDelay, decaySpeed) {
            if (typeof radius === "undefined") { radius = 8; }
            if (typeof decayDelay === "undefined") { decayDelay = 2; }
            if (typeof decaySpeed === "undefined") { decaySpeed = 1; }
            _super.call(this, game, x, y, baseCircleShape);
            this.radius = radius;
            this.decayDelay = decayDelay;
            this.decaySpeed = decaySpeed;
            this.active = true;
            this.exploding = false;
            this.decaying = false;

            this.decayAmount = 0.5 * this.decaySpeed;
            this.explodeAmount = 1.8 * this.decaySpeed;
            this.explodeCap = this.radius * 4;
        }
        spawnedCircle.prototype.explode = function () {
            this.exploding = true;
            this.body.velocity.setTo(0);

            // After given delay, start decaying
            setTimeout(function (_this) {
                _this.decaying = true;
                _this.exploding = false;
            }, this.decayDelay * 1000, this);
        };

        spawnedCircle.prototype.step = function () {
            // Check if circle is exploding, exploded, or in the process of exploding
            if (this.decaying) {
                // Make sure we don't go to a negative dimension size
                if (this.radius - this.decayAmount > 0) {
                    this.radius = this.radius - this.decayAmount;

                    // Get new dimensions from radius
                    this.height = this.radius * 2;
                    this.width = this.radius * 2;

                    // Make sure object's center stays in place when resized
                    this.position.x = this.position.x + this.decayAmount;
                    this.position.y = this.position.y + this.decayAmount;
                } else {
                    this.active = false;
                }
            } else if (this.exploding) {
                if (this.radius + this.explodeAmount < this.explodeCap) {
                    this.radius = this.radius + this.explodeAmount;

                    // Get new dimensions from radius
                    this.height = this.radius * 2;
                    this.width = this.radius * 2;

                    // Make sure object's center stays in place when resized
                    this.position.x = this.position.x - this.explodeAmount;
                    this.position.y = this.position.y - this.explodeAmount;
                }
            }

            return this.active;
        };
        return spawnedCircle;
    })(Phaser.Sprite);

    var Staging = (function (_super) {
        __extends(Staging, _super);
        function Staging() {
            _super.apply(this, arguments);
            this.circlesList = [];
            this.framesElapsed = 0;
            this.framesAverage = 0;
            this.startFrames = false;
        }
        Staging.prototype.preload = function () {
        };

        Staging.prototype.create = function () {
            var _this = this;
            // Do not pause on focus loss
            this.game.stage.disableVisibilityChange = true;

            // Capture mouse position on every tick, play background music
            this.mousePosition = this.game.input.position;
            this.guileTheme = this.game.add.audio('guileTheme', 1, false);
            this.randomSound = this.game.add.audio('randomSound', 1, false);
            this.backgroundMusic1 = this.game.add.audio('soundtrack1', 1, false);
            this.backgroundMusic2 = this.game.add.audio('soundtrack2', 1, false);
            this.backgroundMusic3 = this.game.add.audio('soundtrack3', 1, false);

            this.backgroundMusic1.onDecoded.add(function () {
                return _this.backgroundMusic1.fadeIn(2000);
            }, this);

            this.backgroundMusic1.onStop.add(function () {
                return _this.backgroundMusic2.play();
            }, this);
            this.backgroundMusic2.onStop.add(function () {
                return _this.backgroundMusic3.play();
            }, this);
            this.backgroundMusic3.onStop.add(function () {
                return _this.backgroundMusic1.play();
            }, this);

            // Start Physics system
            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            // Register clicks and spawn circles
            this.game.input.onDown.add(this.addCircle, this);

            // Spacebar spawns 100 circles
            var spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            spacebar.onDown.add(function () {
                for (var i = 0; i <= 100; i++) {
                    _this.spamCircles(false);
                }
            }, this);

            // Create BitmapData for sprites
            this.baseCircleShape = this.game.add.bitmapData(64, 64);
            this.baseCircleShape.ctx.beginPath();
            this.baseCircleShape.ctx.arc(32, 32, 32, 0, 2 * Math.PI, false);
            this.baseCircleShape.ctx.fillStyle = '#fff';
            this.baseCircleShape.ctx.fill();

            //this.testCircle = this.addCircle(500, 500, false);
            var style = { font: "14px Arial", fill: "#fff" };
            this.circleCounter = this.game.add.text(32, this.game.world.height - 50, "Circles: 0", style);

            // Start our FPS counter
            this.game.time.advancedTiming = true;

            // Wait three seconds, then display the FPS counter.
            setTimeout(function (_this) {
                var style = { font: "14px Arial", fill: "#fff" };
                _this.fpsCounter = _this.game.add.text(32, 32, "Current: 0 FPS", style);
                _this.fpsAverage = _this.game.add.text(32, 64, "Average: 0 FPS", style);

                _this.startFrames = true;
            }, 3000, this);
        };

        Staging.prototype.update = function () {
            this.spamCircles();
            this.updateCircles();
            this.drawFramerate();
            //this.game.debug.pointer(this.game.input.activePointer);
            //this.game.debug.soundInfo(this.backgroundMusic1, 32, 400);
        };

        Staging.prototype.addCircle = function (x, y, click) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof click === "undefined") { click = true; }
            var getRandom = function (min, max) {
                return Math.random() * (max - min) + min;
            };
            var getRandomInt = function (min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            };
            var getRandomPosNeg = function (min, max) {
                return Math.random() >= 0.50 ? getRandomInt(min, max) : -getRandomInt(min, max);
            };

            if (click) {
                x = this.mousePosition.x - 4;
                y = this.mousePosition.y - 4;
            }

            // Create circles and add to game
            var newCircle = new spawnedCircle(this.game, x, y, this.baseCircleShape);
            newCircle.height = 16;
            newCircle.width = 16;

            // Add random opacity and tint (color)
            newCircle.tint = Math.random() * 0xffffff;
            newCircle.alpha = getRandom(0.4, 1);

            // Add to the game's draw list, enable physics
            this.game.add.existing(newCircle);
            this.game.physics.enable(newCircle, Phaser.Physics.ARCADE);

            // Add Physics params
            newCircle.body.bounce.setTo(1);
            newCircle.body.velocity.setTo(getRandomPosNeg(100, 200), getRandomPosNeg(100, 200));
            newCircle.body.collideWorldBounds = true;

            // Was it a click? Explode it before we call it a day.
            if (click) {
                newCircle.explode();
            }

            // Append it to a running collection
            this.circlesList.push({ "shape": newCircle, "recycle": false });
        };

        Staging.prototype.drawFramerate = function () {
            if (this.startFrames) {
                this.framesElapsed = this.framesElapsed + 1;
                this.framesAverage = this.framesAverage + (this.game.time.fps - this.framesAverage) / this.framesElapsed;

                this.fpsCounter.setText("Current: " + this.game.time.fps + " FPS");
                this.fpsAverage.setText("Average: " + Math.floor(this.framesAverage) + " FPS");
            }
        };

        Staging.prototype.updateCircles = function () {
            // Keep our counter up to date
            this.circleCounter.setText("Circles: " + this.circlesList.length);

            if (this.circlesList.length > 0) {
                for (var key in this.circlesList) {
                    var currentShape = this.circlesList[key].shape;

                    // Is the Sprite still alive?
                    if (currentShape.step()) {
                        // Is it exploding?
                        if (currentShape.exploding || currentShape.decaying) {
                            // Checking for collisions is a fairly expensive operation. Make sure we are only checking circles within 3 radii that aren't exploding.
                            var maximumDistance = currentShape.explodeCap * 3;

                            // Determine the maximum and minimum possible X and Y values.
                            var collisionAreaX = [(currentShape.x + currentShape.radius) - maximumDistance, (currentShape.x + currentShape.radius) + maximumDistance];
                            var collisionAreaY = [(currentShape.y + currentShape.radius) - maximumDistance, (currentShape.y + currentShape.radius) + maximumDistance];

                            // Filter our circlesList to only matches
                            var collisionCandidates = this.circlesList.filter(function (circle) {
                                // Make sure we're not wasting our time, check that it isn't already exploding or decaying.
                                if (circle.shape.exploding || circle.shape.decaying) {
                                    return false;
                                } else {
                                    // This is a rough approximation, so we'll find the center without calculating the outer bounds
                                    var circleCenter = [circle.shape.x + circle.shape.radius, circle.shape.y + circle.shape.radius];

                                    // Check that it's within the bounds of a very generous area.
                                    var isSameRow = circleCenter[1] >= collisionAreaY[0] && circleCenter[1] <= collisionAreaY[1];
                                    var isSameColumn = circleCenter[0] >= collisionAreaX[0] && circleCenter[0] <= collisionAreaX[1];

                                    return isSameRow && isSameColumn;
                                }
                            });

                            for (var collisionKey in collisionCandidates) {
                                var collidingShape = collisionCandidates[collisionKey].shape;

                                // No self collisions allowed.
                                if (!Object.is(currentShape, collidingShape)) {
                                    // Are they colliding? This is a very expensive operation.
                                    if (currentShape.overlap(collidingShape)) {
                                        collidingShape.explode();
                                    }
                                }
                            }
                        }
                    } else {
                        currentShape.destroy();
                        this.circlesList[key].recycle = true;
                    }
                }

                // Garbage collect
                this.circlesList = this.circlesList.filter(function (circle) {
                    return circle.recycle == false;
                });
            }
        };

        Staging.prototype.spamCircles = function (random) {
            if (typeof random === "undefined") { random = true; }
            var getRandomInt = function (min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            };
            if (Math.random() >= 0.9 || random == false) {
                var positionX = getRandomInt(0, this.game.stage.width);
                var positionY = getRandomInt(0, this.game.stage.height);

                this.addCircle(positionX, positionY, false);
            }
        };
        return Staging;
    })(Phaser.State);
    Languid.Staging = Staging;
})(Languid || (Languid = {}));
//# sourceMappingURL=game.js.map
