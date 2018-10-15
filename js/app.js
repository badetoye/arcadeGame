"use strict"

/**
 * @description - global variables
 */
let currentScore = 0; // This holds the current score
const level = document.getElementById('level');
const bgSound = document.getElementById('bgSound');
const score = document.getElementById('score');
const timer = document.getElementById('time');
let timeUpdate; //holds the setTimeout for the time

/**
 * @function Enemy
 * @description A constuctor function for
 * the enemy bug object
 * @param {Number} x
 * @param {Number} y
 * @param {Number} speed
 */
var Enemy = function (x, y, speed) {
    this.x = x;
    this.y = y + 60;
    this.move = 101;
    this.speed = speed;
    this.resetMove = -this.move;
    this.sprite = 'images/enemy-bug.png';
};

/**
 * @function - update
 * @description - Update the enemy's position, required method for game
 * Parameter: dt, a time delta between ticks
 * @param {Number} dt
 */
Enemy.prototype.update = function (dt) {
    if (this.x < this.move * 5) {
        // increment the enemies speed by speed * dt
        this.x += this.speed * dt;
    } else {
        //reset the enemies movement to the initial position
        this.x = this.resetMove;
    }
};

/**
 * @description - Draw the enemy on the screen.
 */
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * @function - Player
 * @description - The player constructor
 */
function Player() {
    this.moveVertical = 83;
    this.moveHorizontal = 101;
    this.posX = this.moveHorizontal * 2;
    this.posY = (this.moveVertical * 4) + 60;
    this.x = this.posX
    this.y = this.posY;
    this.sprite = `images/char-boy.png`;
    this.win = false; // check game win
    this.count = 0; // level counter
}

// Add render method to the player constructor
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Change image of the player
Player.prototype.changePlayerImage = function (playerImage) {
    this.sprite = `images/${playerImage}`;
}

// Add handleInput method to the player constructor
Player.prototype.handleInput = function (input) {
    if ((input === 'up') && this.y > 0) {
        this.y -= this.moveVertical;
    } else if ((input === 'left') && this.x > 0) {
        this.x -= this.moveHorizontal;
    } else if ((input === 'down') && this.y < this.moveVertical * 4) {
        this.y += this.moveVertical;
    } else if ((input === 'right') && this.x < this.moveHorizontal * 4) {
        this.x += this.moveHorizontal;
    }
}

//added update method to the player object
Player.prototype.update = function () {
    // loop through all the enemies and check for collision and win
    for (enemy of allEnemies) {
        // Collision check here
        if ((this.y === enemy.y) && ((enemy.x + enemy.move / 2 > this.x) && (enemy.x < this.x + this.moveHorizontal / 2))) {
            // Play sound
            const collideSound = document.getElementById('collideSound');
            collideSound.play();
            // Deduct score by 3
            if (score.textContent <= 0) {
                score.textContent = 0;
            } else {
                score.textContent -= 3;
            }

            // show the thumbs-down image as a sign for lose when the player collides with the enemy-bug
            const lose = document.getElementById('lose');
            lose.classList.remove('hide');
            setTimeout(() => {
                lose.classList.add('hide');
            }, 750);

            // Reset player
            this.reset();
        }
    }

    // Check win and Reset player
    if (this.y === -23) {
        this.count++;
        this.y = this.posY;
        // Update score by 5
        currentScore += 3
        score.textContent = currentScore;

        // show the thumbs-up image as a sign for win when the player crosses over the water
        const win = document.getElementById('win');
        win.classList.remove('hide');
        setTimeout(() => {
            win.classList.add('hide');
        }, 750);

        // Play sound when the player wins (crosses over the water);
        const winSound = document.getElementById('winSound');
        winSound.play();

        // New levels, alter enemies and their speed
        updateLevel();

        // Show Modal on game over
        congratulations();
    }
}

// Show modal window for Game Instructions and Player Selection on page load with the background sound playing
const startModal = document.getElementById('startModalContainer');
window.addEventListener('DOMContentLoaded', function () {
    if (startModal.classList.contains('hideModal')) {
        setTimeout(() => {
            startModal.classList.remove('hideModal');
        }, 850);
    }
});

Player.prototype.reset = function () {
    // set the Player x and y to initial x and y
    this.x = this.posX;
    this.y = this.posY;
}

// Creating an instance of the Player object
const player = new Player();

/**
 * Allow the user to choose an image for the player
 */
(function () {
    const players = document.getElementById('players');
    const charBoy = document.querySelector('img[data-img="char-boy.png"]');
    const catGirl = document.querySelector('img[data-img="char-cat-girl.png"]');
    const hornGirl = document.querySelector('img[data-img="char-horn-girl.png"]');
    const pinkGirl = document.querySelector('img[data-img="char-pink-girl.png"]');
    const princessGirl = document.querySelector('img[data-img="char-princess-girl.png"]');
    const startGame = document.getElementById('startGame');

    function selectPlayer() {
        const selected = document.getElementById('selectSound');
        players.addEventListener('click', function (e) {
            let selectedImg;
            // Play background sound
            bgSound.play();
            bgSound.loop = true;
            bgSound.preload = 'auto';
            if (e.target) {
                selectedImg = e.target.dataset.img;
            }
            switch (e.target) {
                // Is char-boy selected?
                case charBoy:
                    // Show selected
                    charBoy.classList.add('selectedPlayer');
                    // Remove selected
                    catGirl.classList.remove('selectedPlayer');
                    hornGirl.classList.remove('selectedPlayer');
                    pinkGirl.classList.remove('selectedPlayer');
                    princessGirl.classList.remove('selectedPlayer');
                    // Play sound when a player is selected
                    selected.play();
                    break;

                    // Is char-cat-girl selected?
                case catGirl:
                    // Show selected
                    catGirl.classList.add('selectedPlayer');
                    // Remove selected
                    charBoy.classList.remove('selectedPlayer');
                    hornGirl.classList.remove('selectedPlayer');
                    pinkGirl.classList.remove('selectedPlayer');
                    princessGirl.classList.remove('selectedPlayer');
                    // Play sound when a player is selected
                    selected.play();
                    break;

                    // Is char-horn-girl selected?
                case hornGirl:
                    // Show selected
                    hornGirl.classList.add('selectedPlayer');
                    // Remove selected
                    charBoy.classList.remove('selectedPlayer');
                    catGirl.classList.remove('selectedPlayer');
                    pinkGirl.classList.remove('selectedPlayer');
                    princessGirl.classList.remove('selectedPlayer');
                    // Play sound when a player is selected
                    selected.play();
                    break;

                    // Is char-pink-girl selected?
                case pinkGirl:
                    // Show selected
                    pinkGirl.classList.add('selectedPlayer');
                    // Remove selected
                    charBoy.classList.remove('selectedPlayer');
                    catGirl.classList.remove('selectedPlayer');
                    hornGirl.classList.remove('selectedPlayer');
                    princessGirl.classList.remove('selectedPlayer');
                    // Play sound when a player is selected
                    selected.play();
                    break;

                    // Is char-princess-girl selected?
                case princessGirl:
                    // Show selected
                    princessGirl.classList.add('selectedPlayer');
                    // Remove selected
                    charBoy.classList.remove('selectedPlayer');
                    catGirl.classList.remove('selectedPlayer');
                    hornGirl.classList.remove('selectedPlayer');
                    pinkGirl.classList.remove('selectedPlayer');
                    // Play sound when a player is selected
                    selected.play();
            }
            // update the player sprite image
            player.changePlayerImage(selectedImg);
        }, false);

        // Set the timer
        let hours = 0; //holds the hours
        let minutes = 0; // holds the minutes
        let seconds = 0; //holds the seconds

        function time() {
            seconds++;
            if (seconds >= 60) {
                seconds = 0;
                minutes++;
                if (minutes >= 60) {
                    minutes = 0;
                    hours++;
                }
            }

            timer.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
            timeCounter();
        }

        function timeCounter() {
            timeUpdate = setTimeout(time, 1000);
        }

        // Hide the instruction modal and play background sound when the Start button is clicked
        startGame.addEventListener('click', function () {
            startModal.classList.add('hideModal');
            // Play background sound
            bgSound.play();
            bgSound.loop = true;
            bgSound.preload = 'auto';
            // Start timer
            timeCounter();
        }, false);
    }

    selectPlayer();
}());

// creating an array of the enemy object
const allEnemies = [];
// Creating instances of the enemy object
let enemy;
enemy = new Enemy(-101, (83 * 0), 135);
allEnemies.push(enemy);
enemy = new Enemy(-101, 83, 120);
allEnemies.push(enemy);
enemy = new Enemy(-101, (83 * 0), 200);
allEnemies.push(enemy);
enemy = new Enemy(-101, (83 * 2), 170);
allEnemies.push(enemy);

// Create more enemies on new Levels
function updateLevel() {
    switch (player.count) {
        // Level 2
        case 5:
            enemy = new Enemy(-101, 83, 85);
            allEnemies.push(enemy);
            level.textContent = `Level: 2`;
            break;

            // Level 3
        case 9:
            enemy = new Enemy(-101, (83 * 2), 105);
            allEnemies.push(enemy);
            level.textContent = `Level: 3`;
            break;

            // Level 4
        case 12:
            enemy = new Enemy(-101, (83 * 0), 125);
            allEnemies.push(enemy);
            level.textContent = `Level: 4`;
            break;

            // Level 5
        case 15:
            enemy = new Enemy(-101, (83 * 2), 195);
            allEnemies.push(enemy);
            level.textContent = `Level: 5`;
            break;

            // Level 6
        case 18:
            enemy = new Enemy(-101, (83 * 2), 315);
            allEnemies.push(enemy);
            bgSound.setAttribute('src', 'sounds/destination-01.ogg');
            bgSound.play();
            level.textContent = `Level: 6`;
            break;

            // Level 7
        case 21:
            enemy = new Enemy(-101, 83, 405);
            allEnemies.push(enemy);
            level.textContent = `Level: 7`;
            break;

            // Level 8
        case 25:
            allEnemies.pop();
            level.textContent = `Level: 8`;
            break;

            // Level 9
        case 29:
            allEnemies.pop();
            allEnemies.pop();
            enemy = new Enemy(-101, (83 * 2), 300);
            allEnemies.push(enemy);
            level.textContent = `Level: 9`;
            break;

            // Level 10
        case 34:
            enemy = new Enemy(-101, (83 * 0), 265);
            allEnemies.push(enemy);
            enemy = new Enemy(-101, 83, 200);
            allEnemies.push(enemy);
            level.textContent = `Level: 10`;
            break;
    }
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        // Arrow keys
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

function congratulations() {
    const congratsModal = document.getElementById('congratsModalWrapper');
    const timeSum = document.getElementById('timeSum');
    const scoreSum = document.getElementById('scoreSum');
    const levelSum = document.getElementById('levelSum');
    const congratSound = document.getElementById('congratSound');
    const replay = document.getElementById('replay');

    if (level.textContent === `Level: 10`) {
        // Update Sound
        bgSound.pause();
        congratSound.play();

        // Pause Timer
        clearTimeout(timeUpdate);

        // Show modal
        congratsModal.classList.remove('hideModal');
        // Update the modal summary details
        timeSum.textContent = `Time ${timer.textContent}`;
        scoreSum.textContent = `Score: ${score.textContent}`;
        levelSum.textContent = level.textContent;

        // Reload Game
        replay.addEventListener('click', function () {
            document.location.reload(true);
        }, false);
    }
}
