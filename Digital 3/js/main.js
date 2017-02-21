
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
    var game = new Phaser.Game(600, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

function preload() {

    //game.load.image('player', 'assets/player.png');
    game.load.image('world','assets/village.png');

}

//globals

//sprite
var sprite;
//world
var world;

function create() {

    
    //player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
    world = game.add.sprite(0, 0, 'world');
    //game.physics.enable(sprite, Phaser.Physics.ARCADE);
    game.physics.enable(world, Phaser.Physics.ARCADE);

}

function update() {

    //  only move when you click // if within bounds!
    if (game.input.mousePointer.isDown)
    {
        //click on doors.  5 cases for each location.  home house, house 2, church, shop, mansion
        //location is relative and based on game input location * scale + world.x (world.body.x ?) * scale
        //each brings new screen up with clickable overhead view
        
      //move around world following mouse location
      world.body.velocity.setTo(-1*(game.input.x-300), -1*(game.input.y-300));
      }
    else
    {
        world.body.velocity.setTo(0, 0);
    }

}
};
