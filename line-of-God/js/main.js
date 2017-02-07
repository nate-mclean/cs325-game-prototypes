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
    game.load.image('panda', 'assets/asteroid.png');
    game.load.image('sweet', 'assets/sprites/spinObj_06.png');

}

var ship;
var starfield;
var cursors;
var pandas;
var playerCollisionGroup;
var pandaCollisionGroup;

function create() {

    //  Enable P2
    game.physics.startSystem(Phaser.Physics.P2JS);

    //  Turn on impact events for the world, without this we get no collision callbacks
    game.physics.p2.setImpactEvents(true);

    game.physics.p2.restitution = 0.8;

    //  Create our collision groups. One for the player, one for the pandas
    playerCollisionGroup = game.physics.p2.createCollisionGroup();
    pandaCollisionGroup = game.physics.p2.createCollisionGroup();

    //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
    //  (which we do) - what this does is adjust the bounds to use its own collision group.
    //game.physics.p2.updateBoundsCollisionGroup();

    starfield = game.add.tileSprite(0, 0, 1000, 600, 'stars');
    starfield.fixedToCamera = true;

    pandas = game.add.group();
    pandas.enableBody = true;
    pandas.physicsBodyType = Phaser.Physics.P2JS;

/*
    for (var i = 0; i < 20; i++)
    {
        var panda = pandas.create(game.world.randomX, game.world.randomY, 'panda');
        panda.body.setRectangle(40, 40);
         panda.body.velocity.x = 75;
    panda.body.velocity.y = 75;
        //panda.body.alpha -= 0.5;

        //  Tell the panda to use the pandaCollisionGroup 
        panda.body.setCollisionGroup(pandaCollisionGroup);

        //  Pandas will collide against themselves and the player
        //  If you don't set this they'll not collide with anything.
        //  The first parameter is either an array or a single collision group.
        panda.body.collides([pandaCollisionGroup, playerCollisionGroup]);
    }
    */

    //  Create our ship sprite
    ship = game.add.sprite(300, 300, 'ship');
    //myGame.physics.arcade.enable(ship);
    //ship.scale.set(2);
    //ship.smoothed = false;
    //ship.animations.add('fly', [0], 1, true);
    //ship.play('fly');

    game.physics.p2.enable(ship, false);
    ship.body.setCircle(30);
    ship.body.fixedRotation = true;

    //  Set the ships collision group
    ship.body.setCollisionGroup(playerCollisionGroup);

    //  The ship will collide with the pandas, and when it strikes one the hitPanda callback will fire, causing it to alpha out a bit
    //  When pandas collide with each other, nothing happens to them.
    ship.body.collides(pandaCollisionGroup);

    game.camera.follow(ship);

    cursors = game.input.keyboard.createCursorKeys();

}

function hitPanda(body1, body2) {

    //  body1 is the space ship (as it's the body that owns the callback)
    //  body2 is the body it impacted with, in this case our panda
    //  As body2 is a Phaser.Physics.P2.Body object, you access its own (the sprite) via the sprite property:
    //body2.sprite.alpha -= 0.1;

}

function update() {

    //ship.body.setZeroVelocity();

        //god fluid space-like movement
    if (cursors.left.isDown)
    {
        ship.body.velocity.x -= 2;
        ship.body.moveLeft(-ship.body.velocity.x + 5);
    }
    else if (cursors.right.isDown)
    {
        ship.body.velocity.x += 2;
        ship.body.moveRight(ship.body.velocity.x + 5);
    }

    if (cursors.up.isDown)
    {
        ship.body.velocity.y -= 2;
        ship.body.moveUp(-ship.body.velocity.y + 5);
    }
    else if (cursors.down.isDown)
    {
        ship.body.velocity.y += 2;
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
 
    
    //spawn pandas randomly 1 in 100 chance

    if((Math.random()*100) > 99){
     var panda = pandas.create(-10, game.world.randomY, 'panda');
     panda.body.setRectangle(40, 40);
     panda.body.velocity.x = Math.floor(Math.random()*250)+50; //50 to 300 x vel
     panda.body.velocity.y = Math.floor(Math.random()*100)-50; //-50  to 50 y vel
 
        //  Tell the panda to use the pandaCollisionGroup 
     panda.body.setCollisionGroup(pandaCollisionGroup);

        //  Pandas will collide against themselves and the player
        //  If you don't set this they'll not collide with anything.
        //  The first parameter is either an array or a single collision group.
    panda.body.collides([pandaCollisionGroup, playerCollisionGroup], hitPanda, this);
         }

}

};
