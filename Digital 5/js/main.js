window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/v2.6.2/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    
    var game = new Phaser.Game( 900, 500, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {

    game.load.image('stars', 'assets/stars.jpg');
    game.load.image('ship', 'assets/god.png', 32, 32);
    game.load.spritesheet('asteroid', 'assets/asteroid.png', 128, 128, 4);
    game.load.image('explosion', 'assets/explosion.png');
    game.load.image('explosion2', 'assets/explosion2.png');
    game.load.image('newgameB', 'assets/newgameButton.png');
    game.load.audio('song', 'assets/aug16.mp3');

}

//sprites
var ship;
var starfield;
var cursors;
var asteroids;
var earth;
var explosions;
var explosionarray = [];

//collisions
var playerCollisionGroup;
var asteroidCollisionGroup;
var earthCollisionGroup;

//text
var wave;
var wavenum;
var health;
var healthnum;
var score;
var scorenum;
var gameover;
var finalscore=0;

//states
var state = 0;

//button
var newgameB;


function create() {
    //music
    var music = game.add.audio('song');
    music.play();

        
        //pHYSICS ENGINE!
    //  Enable P2
    game.physics.startSystem(Phaser.Physics.P2JS);
    //  Turn on impact events for the world, without this we get no collision callbacks
    game.physics.p2.setImpactEvents(true);
    game.physics.p2.restitution = 1.5;

    //  Create our collision groups. Player, asteroids, earth
    playerCollisionGroup = game.physics.p2.createCollisionGroup();
    asteroidCollisionGroup = game.physics.p2.createCollisionGroup();
    earthCollisionGroup = game.physics.p2.createCollisionGroup();
    

    //ADD background
    starfield = game.add.tileSprite(0, 0, 1000, 600, 'stars');
    starfield.fixedToCamera = true;

        //asteroid group
    asteroids = game.add.group();
    asteroids.enableBody = true;
    asteroids.physicsBodyType = Phaser.Physics.P2JS;
    
    //add group for explosions
    explosions = game.add.group();
    
    //world bounds collision
    earth = game.add.tileSprite(1000, 0, 10, 500, 'ship');
    game.physics.p2.enable(earth, false);
    earth.body.setRectangle(50, 1000);
    //collides with asteroids
    earth.body.setCollisionGroup(earthCollisionGroup);
    earth.body.collides(asteroidCollisionGroup);
    earth.body.fixedRotation = true;
    //earthCollisionGroup = game.physics.p2.createCollisionGroup();

    //  Create our ship sprite
    ship = game.add.sprite(300, 300, 'ship');

    game.physics.p2.enable(ship, false);
    ship.body.setCircle(30);
    ship.body.fixedRotation = true;

    //  Set the ships collision group
    ship.body.setCollisionGroup(playerCollisionGroup);

    //  ship collides with asteroids
    ship.body.collides(asteroidCollisionGroup);

    game.camera.follow(ship);

    cursors = game.input.keyboard.createCursorKeys();
    
    //buttons
    newgameB = game.add.sprite(500, 300, 'newgameB');
    newgameB.visible = false;
    newgameB.inputEnabled = true;

    
    //wave 
        wave = game.add.text(320, 30, "", { font: "50px Arial", fill: "#ff0044", align: "center" });
    //health
        health = game.add.text(680, 30, "Health: 100", { font: "30px Arial", fill: "#ff0044", align: "center" });
        healthnum = 100;
    //score
        score = game.add.text(50, 30, "Score: 0", { font: "30px Arial", fill: "#ff0044", align: "center" });
        scorenum = 0;
     //game over
        gameover = game.add.text(200, 50, "", { font: "30px Arial", fill: "#ff0044", align: "center" });
    
}

//asteroid collision
function hitAsteroid(body1, body2) {

    //show explosion
       var explosion = explosions.create((body1.x + body2.x)/2-200, (body1.y + body2.y)/2-100, 'explosion2');
       explosionarray.push(explosion);

    //remove both bodies from screen
    //body1 = null;
    //body2 = null;
    //body1.x = 1000;
    //body2.x = 1000;
    body1.x = 5000;
    body1.velocity.x = 0;
    body2.x = 5000;
    body2.velocity.x = 0;
    
      //add to score
      scorenum += 500;  
}
//earth collision
function hitEarth(body1, body2) {
   //show explosion
       var explosion = explosions.create(body1.x -200, body1.y -100, 'explosion');
        explosionarray.push(explosion);
        
//remove some health
    healthnum -= 5;
    //body1.alpha = 0;
    body1.x = 5000;
    body1.velocity.x = 0;
    //body1.alpha = 0;
}

//new game button click
function newgameButton () {
    //clear all trees and bulldozers
    //clearAll();
    //reset all values
    newgameB.visible = false;
    healthnum = 100;
    scorenum = 0;
    gameover.setText("");
    
    //change state 
    state = 1;

    
    }

function update() {

    //display health and score
        score.setText("Score: "+scorenum);
    //remove explosions
        var i;
        for (i = 0; i < explosionarray.length; i++) { 
        if(explosionarray[i].alpha > .01)
            explosionarray[i].alpha -= .01;
        }
        
        
          //non playing state
    if(state === 0){ 
            health.setText("");
            gameover.setText("");

        if(healthnum > 0 ) { //new game{
            wave.setText("");
            gameover.setText("  Arrow keys to move, \nhit meteors and smash them \n\nstop them from hitting earth");
      }
        else if ( scorenum < 100000) //game over text
            wave.setText("GAME OVER");
        else{
            wave.setText("You saved Earth!");
            }
            
            
            //player handling
            ship.body.velocity.x = 0;
            ship.body.velocity.y =  0;
            ship.body.x = 300;
            ship.body.y =  300;
            //clear asteroids
        asteroids.forEach(function(item) {
        
           item.destroy(); 
    }, this);
            
        newgameB.visible = true;
        newgameB.events.onInputDown.add(newgameButton, this);
        }
        
        
            //in game playing state
     if(state === 1)  {  
            health.setText("Health: "+healthnum);
            newgameB.visible = false;
         //inscrease score
        scorenum += 1;
        //show wave
        wave.setText("Wave " + wavenum +"/10");
        wavenum = Math.floor(scorenum/10000) + 1;
  
    //if health or score above 100000 goes below 0 end game
        if( healthnum <= 0 || scorenum > 100000){
            score.setText(" ");
            health.setText(" ");
            healthnum = 0;            
            if(finalscore === 0)
            finalscore = scorenum;
            state = 0;
            }

    //handling sprites
    ///keep earth body in place
        earth.body.x=900;
        earth.body.y=0;
    //remove all asteroid bodies
        asteroids.forEach(function(item) {
            if(item.x > 2000 || item.x < -300 || item.y > 1000 || item.y < -100)
                item.destroy(); 
        }, this);
        

        //god fluid space-like movement
    if (cursors.left.isDown)
    {
        ship.body.velocity.x -= 5;
        ship.body.moveLeft(-ship.body.velocity.x + 5);
    }
    else if (cursors.right.isDown)
    {
        ship.body.velocity.x += 5;
        ship.body.moveRight(ship.body.velocity.x + 5);
    }

    if (cursors.up.isDown)
    {
        ship.body.velocity.y -= 5;
        ship.body.moveUp(-ship.body.velocity.y + 5);
    }
    else if (cursors.down.isDown)
    {
        ship.body.velocity.y += 5;
        ship.body.moveDown(ship.body.velocity.y + 5);
    }


        //keep god in bounds. bounce him back in
    if (ship.body.x > 880 || ship.body.x < 20)
    {
        if(ship.body.x <= 20 ) ship.body.x = 22;
        if(ship.body.x >= 880 ) ship.body.x = 878;
        
        ship.body.velocity.x = -1 * ship.body.velocity.x;
    }

    if (ship.body.y > 480 || ship.body.y < 20)
    {
        if(ship.body.y <= 20 ) ship.body.y = 22;
        if(ship.body.y >= 480 ) ship.body.y = 478;
        
        ship.body.velocity.y = -1 * ship.body.velocity.y;
    }
 
    
    //spawn asteroids randomly ..

    if((Math.random()*200) > (196 - Math.floor(scorenum/10000) )){
     var asteroid = asteroids.create(-10, game.world.randomY, 'asteroid');
     
     asteroid.frame = Math.floor(Math.random() * 5 );
     
     asteroid.body.setRectangle(70, 70);
     //x velocity grows as more meteors destroyed
     asteroid.body.velocity.x = Math.floor((Math.random()*150)+120+(explosionarray.length/20)); //50 to 300+ x vel
     asteroid.body.velocity.y = Math.floor(Math.random()*100)-50; //-50  to 50 y vel
 
        //  Tell the asteroid to use the asteroidCollisionGroup 
     asteroid.body.setCollisionGroup(asteroidCollisionGroup);

        //  asteroid will collide against themselves, call hitAsteroid method
    asteroid.body.collides(asteroidCollisionGroup, hitAsteroid, this);
    //asteroid collides against ship
    asteroid.body.collides(playerCollisionGroup);
    
    //asteroid collides against earth
    asteroid.body.collides(earthCollisionGroup, hitEarth, this);
         }

    }
}

};
