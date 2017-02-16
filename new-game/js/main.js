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
    
    var game = new Phaser.Game( 1000, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {

    game.load.spritesheet('bird', 'assets/stunDrone.png', 240, 314, 22);
    game.load.spritesheet('drone', 'assets/bird.png', 104, 100, 9);
    game.load.image('stars', 'assets/bkg.png');
    game.load.image('cloud', 'assets/cloud.png');
    game.load.image('ship', 'assets/god.png', 32, 32);
    game.load.image('asteroid', 'assets/tree.png');
    game.load.image('house', 'assets/house.png');    
    game.load.image('win', 'assets/robin.jpg');
    game.load.audio('song', ['assets/song.mp3','assets/song.ogg']);


}
//music
var music;

//game state
var state = false;
//sprites
var ship;
var starfield;
var cursors;
var asteroids;
var drones;
var clouds;
var win;


//collisions
var playerCollisionGroup;
var asteroidCollisionGroup;

//text
var health;
var score;
var scorenum;
var gameover;
var gameoversub;
var finalscore=0;
var info;

//restrart button
var key1;

function create() {

//music 
music = game.add.audio('song');
        
        //restart button 
            key1 = game.input.keyboard.addKey(Phaser.Keyboard.N);
    key1.onDown.add(restart, this);


    
        //pHYSICS ENGINE!
    //  Enable P2
    game.physics.startSystem(Phaser.Physics.P2JS);
    //  Turn on impact events for the world, without this we get no collision callbacks
    game.physics.p2.setImpactEvents(true);
    game.physics.p2.restitution = 0.8;

    //  Create our collision groups. Player, asteroids
    playerCollisionGroup = game.physics.p2.createCollisionGroup();
    asteroidCollisionGroup = game.physics.p2.createCollisionGroup();
    

    //ADD background
    starfield = game.add.tileSprite(0, 0, 1000, 600, 'stars');
    starfield.fixedToCamera = true;
    
        //win image
    win = game.add.sprite(0, 0, 'win');
       win.alpha = .15;

        //asteroid group
    asteroids = game.add.group();
    asteroids.enableBody = true;
    asteroids.physicsBodyType = Phaser.Physics.P2JS;
    //drone grtoup
    drones = game.add.group();
    drones.enableBody = true;
    drones.physicsBodyType = Phaser.Physics.P2JS;
    //cloud group
    clouds = game.add.group();
    clouds.enableBody = true;
    
    
    
    //  Create our ship sprite
    ship = game.add.sprite(600, 200, 'bird');
     ship.animations.add('fly');

    ship.animations.play('fly', 10, true);

    game.physics.p2.enable(ship, false);
    ship.body.setCircle(30);
    ship.body.fixedRotation = true;

    //  Set the ships collision group
    ship.body.setCollisionGroup(playerCollisionGroup);

    //  ship collides with asteroids
    ship.body.collides(asteroidCollisionGroup);

    game.camera.follow(ship);

    cursors = game.input.keyboard.createCursorKeys();
    
    //health
        health = game.add.text(550, 30, "up or down arrowkeys to fly", { font: "30px Arial", fill: "#ff0044", align: "center" });
        info = game.add.text(700, 80, "Goal: 2000m", { font: "22px Arial", fill: "#ff0044", align: "center" });
        //healthnum = 100;
    //score
        score = game.add.text(50, 30, "Score: 0", { font: "30px Arial", fill: "#ff0044", align: "center" });
        scorenum = 0;
     //game over
        gameover = game.add.text(300, 100, "", { font: "75px Arial", fill: "#ff0044", align: "center" });
        gameoversub = game.add.text(600, 300, "", { font: "30px Arial", fill: "#ff0044", align: "center" });
}


//player colission
function hitPlayer(body1, body2) {
    
    state = false;
            score.setText(" ");
            health.setText(" ");
            info.setText(" ");

            if(finalscore === 0)
            finalscore = scorenum;
            gameover.setText("GAME OVER \nscore: "+finalscore+"m");
            gameoversub.setText("press N to play again");
            body1.velocity.x=0;
            body2.velocity.x=0;
            body1.velocity.y=0;
            body2.velocity.y=0;
            
            //freeze world
        drones.forEach(function(item) {
 item.body.velocity.x=0;
 
}, this);
        asteroids.forEach(function(item) {
 item.body.velocity.x=0;
 
}, this);

clouds.forEach(function(item) {
 item.body.velocity.x=0;
 
}, this);
            
}

//press restart button
function  restart () {
    
state = true;
    music.play();

    gameover.setText("");
    gameoversub.setText("");
    finalscore = 0;
    scorenum=0;
    ship.body.x = 600;
    ship.body.y = 200;
    ship.body.velocity.x=0;
    ship.body.velocity.y=0;
    ship.visible = true;

    
    var i;
            //remove old drones and trees
            for(i=0 ; i<5 ; i++) {
        drones.forEach(function(item) {
 item.destroy();
 
}, this);
        asteroids.forEach(function(item) {
 item.destroy();
 
}, this);

clouds.forEach(function(item) {
 item.destroy();
 
}, this);
}
}

function update() {

    //keep birds / trees in front
    game.world.bringToTop(drones);
    game.world.bringToTop(asteroids);
       
       //won game
       if(scorenum > 2000){
           state = false;
           //show win image
            win.alpha = 1;
            score.setText(" ");
            health.setText(" ");
            info.setText(" ");
            if(finalscore === 0)
            finalscore = scorenum;
            gameover.setText("You win!! ");
            }
            
      if(state === false) {
          gameoversub.setText("press N for new game");
            }  


 
    if(state === true){
          //display score
        scorenum += 1;
           win.alpha = 0;
       score.setText("Distance: "+scorenum+"m");
        gameoversub.setText("");
                //bird movement!!!
        //gravity
         ship.body.velocity.y += 10;
            if (cursors.up.isDown)
    {
        ship.body.velocity.y -= 20;
        ship.body.moveUp(-ship.body.velocity.y + 5);
    }
        else if (cursors.down.isDown)
    {
        ship.body.velocity.y += 10;
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
             //spawn clouds randomly (non collision)
            if((Math.random()*200) > 195){
     var cloud = clouds.create(-200, Math.floor((Math.random()*300)+50), 'cloud');
     //x velocity grows as more meteors destroyed
     cloud.body.velocity.x = Math.floor(500 + scorenum/5); //50 to 300+ x vel
     //asteroid.body.velocity.y = Math.floor(Math.random()*200)-50; //-50  to 50 y vel
         }
         
    //spawn different trees randomly ..
    if((Math.random()*200) > 199 && scorenum < 2000){
        //tree or house
        if(Math.random() > .8) {
     var asteroid = asteroids.create(-200, 375, 'asteroid');
     asteroid.body.setRectangle(100, 300);
     }
     else{
         var asteroid = asteroids.create(-200, 420, 'house');
         asteroid.body.setRectangle(100, 120);
         }
     //x velocity grows as more meteors destroyed
     asteroid.body.velocity.x = Math.floor(500 + scorenum/6); //50 to 300+ x vel
     //asteroid.body.velocity.y = Math.floor(Math.random()*200)-50; //-50  to 50 y vel
 
        //  Tell the asteroid to use the asteroidCollisionGroup 
     asteroid.body.setCollisionGroup(asteroidCollisionGroup);

        //  asteroid will collide against themselves, call hitAsteroid method
    //asteroid.body.collides(asteroidCollisionGroup, hitAsteroid, this);
    //asteroid collides against ship
    asteroid.body.collides(playerCollisionGroup, hitPlayer, this);
 
         }
         //spawn drones randomly
    if((Math.random()*200) > 199 && scorenum < 2000){
     var drone = drones.create(-100, Math.floor((Math.random()*250)+50), 'drone');
      drone.animations.add('fly');

      drone.animations.play('fly', 10, true);
     drone.body.setRectangle(59, 50);
     //x velocity grows as more meteors destroyed
     drone.body.velocity.x = Math.floor(500 + scorenum/6); //50 to 300+ x vel
     drone.body.velocity.y = Math.floor(60 - Math.random()*120); //50 to 300+ x vel
     //asteroid.body.velocity.y = Math.floor(Math.random()*200)-50; //-50  to 50 y vel
     
 
        //  Tell the asteroid to use the asteroidCollisionGroup 
     drone.body.setCollisionGroup(asteroidCollisionGroup);

        //  asteroid will collide against themselves, call hitAsteroid method
    //asteroid.body.collides(asteroidCollisionGroup, hitAsteroid, this);
    //asteroid collides against ship
    drone.body.collides(playerCollisionGroup, hitPlayer, this);
         }
         
                 //remove old drones and trees
        
        drones.forEach(function(item) {
 if(item.body.x > 1100)
 item.destroy();
 
}, this);
        asteroids.forEach(function(item) {
 if(item.body.x > 1300)
 item.destroy();
 
}, this);

clouds.forEach(function(item) {
 if(item.body.x > 1100)
 item.destroy();
 
}, this);
         }
         

}


};
