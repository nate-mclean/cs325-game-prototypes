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
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // Load an image and call it 'logo'.
        game.load.image( 'logo', 'assets/phaser.png' );
    }
    
    //var bouncy;
    var i;
    var r;
    var bmd;
    var bmdDest;        
    var colors;
    
    function create() {
bmd = game.make.bitmapData(game.width, game.height);

    bmdDest = game.make.bitmapData(game.width, game.height);
    bmdDest.addToWorld();

    colors = Phaser.Color.HSVColorWheel();

    game.input.addMoveCallback(paint, this);

    i = 0;
    r = new Phaser.Rectangle(0, 0, game.width, game.height);

    //  r = the rotation, s = the scale
    data = { r: 0, s: 0.5 };

    //  Change the tween duration, ease type, values, etc for different effects
    game.add.tween(data).to( { r: 360, s: 2 }, 2000, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.MAX_VALUE, true);

}

function paint(pointer, x, y) {

    if (pointer.isDown)
    {
        //  Change the 4 - the width of the pen, to anything you like
        bmd.circle(x, y, 6, colors[i].rgba);

        i = game.math.wrapValue(i, 1, 300);
    }

}

function update() {

    //  Change the 0.1 to something like 0.5 for a shorter 'trail'
    bmdDest.fill(0, 0, 0, 0.5);

    //  Change the 0.7 at the end, it's the alpha value, lower it for a softer effect
    bmdDest.copy(bmd, 0, 0);

}
};
