module Languid {

  class spawnedCircle extends Phaser.Sprite {
    private interval;

    public active: boolean = true;

    public exploding: boolean = false;
    public decaying: boolean = false;

    public decayAmount: number;
    public explodeAmount: number;
    public explodeCap: number;

    constructor(game: Phaser.Game, x: number, y: number, baseCircleShape: any, public radius: number = 8, public decayDelay: number = 2, public decaySpeed: number = 1) {
      super(game, x, y, baseCircleShape);

      this.decayAmount = 0.5 * this.decaySpeed;
      this.explodeAmount = 1.8 * this.decaySpeed;
      this.explodeCap = this.radius * 4;
    }

    explode() {
      this.exploding = true;
      this.body.velocity.setTo(0);
      
      // After given delay, start decaying
      setTimeout(function (_this) {
        _this.decaying = true;
        _this.exploding = false;
      }, this.decayDelay * 1000, this);
    }

    step() {

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
        }

        // Explosion has been triggered, circle has decayed as close to 0 as it will get. Remove it from the world.
        else {
          this.active = false;
        }
      }

      else if (this.exploding) {
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
    }
  }

  export class Staging extends Phaser.State {

    backgroundMusic1: Phaser.Sound;
    backgroundMusic2: Phaser.Sound;
    backgroundMusic3: Phaser.Sound;
    guileTheme: Phaser.Sound;
    randomSound: Phaser.Sound;

    baseCircleShape: Phaser.BitmapData;

    circleCounter: Phaser.Text;
    fpsAverage: Phaser.Text;
    fpsCounter: Phaser.Text;

    mousePosition: Phaser.Point;

    circlesList = [];
    framesElapsed: number = 0;
    framesAverage: number = 0;
    startFrames: boolean = false;
    testCircle;

    preload() {}

    create() {
      // Do not pause on focus loss
      this.game.stage.disableVisibilityChange = true;
      
      // Capture mouse position on every tick, play background music
      this.mousePosition = this.game.input.position;
      this.guileTheme = this.game.add.audio('guileTheme', 1, false);
      this.randomSound = this.game.add.audio('randomSound', 1, false);
      this.backgroundMusic1 = this.game.add.audio('soundtrack1', 1, false);
      this.backgroundMusic2 = this.game.add.audio('soundtrack2', 1, false);
      this.backgroundMusic3 = this.game.add.audio('soundtrack3', 1, false);

      this.backgroundMusic1.onDecoded.add(() => this.backgroundMusic1.fadeIn(2000), this);

      this.backgroundMusic1.onStop.add(() => this.backgroundMusic2.play(), this);
      this.backgroundMusic2.onStop.add(() => this.backgroundMusic3.play(), this);
      this.backgroundMusic3.onStop.add(() => this.backgroundMusic1.play(), this);

      // Start Physics system
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      // Register clicks and spawn circles
      this.game.input.onDown.add(this.addCircle, this);

      // Spacebar spawns 100 circles
      var spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      spacebar.onDown.add(() => {
        for (var i = 0; i <= 100; i++) {
          this.spamCircles(false);
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
      this.game.time.advancedTiming = true

      // Wait three seconds, then display the FPS counter.
      setTimeout(function (_this) {
        var style = { font: "14px Arial", fill: "#fff" };
        _this.fpsCounter = _this.game.add.text(32, 32, "Current: 0 FPS", style);
        _this.fpsAverage = _this.game.add.text(32, 64, "Average: 0 FPS", style);

        _this.startFrames = true;
      }, 3000, this);
    }

    update() {
      this.spamCircles();
      this.updateCircles();
      this.drawFramerate();

      //this.game.debug.pointer(this.game.input.activePointer);
      //this.game.debug.soundInfo(this.backgroundMusic1, 32, 400);
    }

    addCircle(x = 0, y = 0, click: boolean = true) {
      var getRandom = (min: number, max: number) => Math.random() * (max - min) + min;
      var getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
      var getRandomPosNeg = (min: number, max: number) => Math.random() >= 0.50 ? getRandomInt(min, max) : -getRandomInt(min, max);

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
    }

    drawFramerate() {
      if (this.startFrames) {
        this.framesElapsed = this.framesElapsed + 1;
        this.framesAverage = this.framesAverage + (this.game.time.fps - this.framesAverage) / this.framesElapsed;

        this.fpsCounter.setText("Current: " + this.game.time.fps + " FPS");
        this.fpsAverage.setText("Average: " + Math.floor(this.framesAverage) + " FPS");
      }
    }

    updateCircles() {
      // Keep our counter up to date
      this.circleCounter.setText("Circles: " + this.circlesList.length);

      if (this.circlesList.length > 0) {

        // Step through every circle's step() loop
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
                }

                else {
                  // This is a rough approximation, so we'll find the center without calculating the outer bounds
                  var circleCenter = [circle.shape.x + circle.shape.radius, circle.shape.y + circle.shape.radius];

                  // Check that it's within the bounds of a very generous area.
                  var isSameRow = circleCenter[1] >= collisionAreaY[0] && circleCenter[1] <= collisionAreaY[1];
                  var isSameColumn = circleCenter[0] >= collisionAreaX[0] && circleCenter[0] <= collisionAreaX[1];

                  return isSameRow && isSameColumn;
                }
              });

              // Run through every pair in the list of close enough candidates.
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
          }

          // Destroy Sprite and mark for deletion if invisible
          else {
            currentShape.destroy();
            this.circlesList[key].recycle = true;
          }
        }

        // Garbage collect
        this.circlesList = this.circlesList.filter(function (circle) {
          return circle.recycle == false;
        });
      }
    }

    spamCircles(random: boolean = true) {
      var getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
      if (Math.random() >= 0.9 || random == false) {
        var positionX = getRandomInt(0, this.game.stage.width);
        var positionY = getRandomInt(0, this.game.stage.height);

        this.addCircle(positionX, positionY, false);
      }
    }
  }
}