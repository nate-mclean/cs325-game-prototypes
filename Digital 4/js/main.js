
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
    var game = new Phaser.Game(1000, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

function preload() {

    this.load.image('plantTreeButton', 'assets/plantTreeButton.png');
    this.load.image('harvestFruitButton', 'assets/HarvestFruitButton.png');
    this.load.image('increaseRegulationsButton', 'assets/IncreaseRegulationsButton.png');
    this.load.image('nextDayButton', 'assets/nextDayButton.png');
    this.load.image('newgameButton', 'assets/newgameButton.png');
    this.load.image('bkg', 'assets/bkg.jpg');
    this.load.image('tree', 'assets/tree.png');
    this.load.image('treeHarvest', "assets/treeHarvest.png");
    this.load.image('bulldozer', 'assets/bulldozer.png');
    this.load.audio('song', 'assets/song.mp3');

}

//globals

var music;
//sprites
var treeB;
var harvestB;
var regB;
var yearB;
var newgameB;
var bkg;

//text
var money;
var year;
var endgame;
var dozers;

//text data
var moneyCount = 70;
var yearCount = 1;

//groups
var trees;
var bulldozers;

//collision groups
var treeCollisionGroup;
var bulldozerCollisionGroup;

//game data values
var bulldozerFreq = 4;
var count = 0;
var gameover = false;


function create() {

//music
    music = game.add.audio('song');
    music.play();

      //pHYSICS ENGINE!
    //  Enable P2
    game.physics.startSystem(Phaser.Physics.P2JS);
    //  Turn on impact events for the world, without this we get no collision callbacks
    game.physics.p2.setImpactEvents(true);
    game.physics.p2.restitution = -2;
    
    treeCollisionGroup = game.physics.p2.createCollisionGroup();
    bulldozerCollisionGroup = game.physics.p2.createCollisionGroup();

//create game enviroment
bkg = game.add.sprite(0, 0, 'bkg');
treeB = game.add.sprite(10, 100, 'plantTreeButton');
treeB.inputEnabled = true;
harvestB = game.add.sprite(10, 250, 'harvestFruitButton');
harvestB.inputEnabled = true;
regB = game.add.sprite(10, 400, 'increaseRegulationsButton');
regB.inputEnabled = true;
yearB = game.add.sprite(680, 10, 'nextDayButton');
yearB.inputEnabled = true;
newgameB = game.add.sprite(670, 10, 'newgameButton');
newgameB.inputEnabled = true;
newgameB.visible = false;

//tree group
    trees = game.add.group();
    trees.enableBody = true;
    trees.physicsBodyType = Phaser.Physics.P2JS;
//dulldozers group
    bulldozers = game.add.group();
    bulldozers.enableBody = true;
    bulldozers.physicsBodyType = Phaser.Physics.P2JS;
    
//game text
    money = game.add.text(50, 30, "", { font: "40px Arial", fill: "#000000", align: "center" });
    money.setText("Money: $" + moneyCount);
    year = game.add.text(420, 30, "", { font: "60px Arial", fill: "#000000", align: "center" });
    year.setText("Year " + yearCount);
    endgame = game.add.text(330, 200, "Increase regulations to \nstop the bulldozers\nand save the forest!!", { font: "60px Arial", fill: "#000000", align: "center" });
    dozers = game.add.text(35, 520, "", { font: "30px Arial", fill: "#000000", align: "center" });
    
//create 2 trees initially
initTrees();

}

function update() {
    //update text fields
        money.setText("Money: $" + moneyCount);
        year.setText("Year " + yearCount);
        dozers.setText("Bulldozers left: " + bulldozerFreq);

    //endgame, win
        if(bulldozerFreq <= 0) {
            endgame.setText("You saved \nthe forest!");
            gameover = true;
            newgameB.visible = true;
            newgameB.events.onInputDown.add(newgameButton, this);            
        }
    //game over
        if( trees.length === 0 && yearCount > 1 && moneyCount < 10) {
            endgame.setText("The forest was \n destroyed..");
            gameover = true;
            newgameB.visible = true;
            newgameB.events.onInputDown.add(newgameButton, this);
            }
        if(gameover) {
            treeB.visible=false;
            harvestB.visible=false;
            regB.visible=false;
            yearB.visible=false;
            }
    
    //tree button click
        treeB.events.onInputDown.add(treeButton, this);
    //next year button click
        yearB.events.onInputDown.add(yearButton, this);
    //harvest fuit button click
        harvestB.events.onInputDown.add(harvestButton, this);
    //increase regulation button click
        regB.events.onInputDown.add(regButton, this);
    //remove buttons when bulldozers present, remove bulldozers
    bulldozers.forEach(function(item) {
        
        if(item.x > -100){
            treeB.visible=false;
            harvestB.visible=false;
            regB.visible=false;
            yearB.visible=false;
            }
        else {
            count++;
           item.destroy(); 
            }
    }, this);
        //restore buttons
    if(count == bulldozerFreq && !gameover)
    {
            treeB.visible=true;
            harvestB.visible=true;
            regB.visible=true;
            yearB.visible=true;
            count=0;
    }
    //destroy trees if off screen
    trees.forEach(function(item) {
              if(item.x === 5000){
                  //item.fruit=false;
                  item.destroy();
                  }
    }, this);

}

//tree button click
function treeButton () {
    //clear intro text
    endgame.setText("");
    //if enough money
    if(moneyCount >= 10) {
    //create tree in tree group
        var tree = trees.create((350 + Math.random()*640), (120 + Math.random()*420), 'tree');
         tree.body.setRectangle(50, 50);
         //fruit boolean
         tree.fruit =false;

     tree.body.setCollisionGroup(treeCollisionGroup);
     
    tree.body.collides(bulldozerCollisionGroup, hitPlayer2, this);


    //update money
        moneyCount -= 10;
        }
}

//harvest button click
function harvestButton () {

    //remove all fruit from trees, increase money
    trees.forEach(function(item) {
        if(item.fruit === true){
        moneyCount += 25;
        item.fruit = false;
         item.loadTexture('tree', 0, false);
        }
    }, this);    

}

//harvest button click
function regButton () {
    
    //if enough money, remove money and decrese bulldozer frequency
   if(moneyCount >= 100){
        moneyCount -= 100;  
        bulldozerFreq -= 1;
    }

}



//next year button click
function yearButton () {
    //clear intro text
    endgame.setText("");
    //create bulldozers
    
    for(var i=0; i< bulldozerFreq ; i++) {
         var bulldozer = bulldozers.create(1000, Math.floor((Math.random()*450)+120), 'bulldozer');
         bulldozer.body.setRectangle(50, 50);
         bulldozer.body.velocity.x = -1 * Math.floor(300 + Math.random()*200);
         bulldozer.body.velocity.y =  30- Math.floor(Math.random()*60);
        bulldozer.body.setCollisionGroup(bulldozerCollisionGroup);
        
         bulldozer.body.collides(treeCollisionGroup, hitPlayer, this);
}
    //update year
        yearCount += 1;
        
    //fruit some trees
    trees.forEach(function(item) {
        if(Math.random() > .5){
        item.loadTexture('treeHarvest', 0, false);
        //fruit++;
        item.fruit = true;
        }
    }, this);
      //hide buttons until all bulldozers have left screen  
        
}

function newgameButton () {
    //clear all trees and bulldozers
    clearAll();
    //reset all values
    newgameB.visible = false;
    moneyCount = 70;
    yearCount = 1;
    count=0;
    gameover = false;
    bulldozerFreq=4;
    endgame.setText("");
    //show buttons
        treeB.visible=true;
        harvestB.visible=true;
        regB.visible=true;
        yearB.visible=true;
        //init trees
        initTrees();
    
    }

    //clear trees, bulldozers
function  clearAll () {
    for(var i = 0 ; i <10 ; i++){
        trees.forEach(function(item) {
        item.destroy();
    }, this);
        bulldozers.forEach(function(item) {
        item.destroy();
    }, this);
    }
}

//initialize 5 trees
    function initTrees() {
            for(var i = 0; i < 5; i++){
        var tree = trees.create((350 + Math.random()*640), (120 + Math.random()*420), 'tree');
         tree.body.setRectangle(50, 50);
         //fruit boolean
         tree.fruit =false;

     tree.body.setCollisionGroup(treeCollisionGroup);
     
    tree.body.collides(bulldozerCollisionGroup, hitPlayer2, this);
    }
}

//bulldozer tree collision
function hitPlayer(body1, body2) {
body2.x = 5000; 
}
//bulldozer tree collision
function hitPlayer2(body1, body2) {
}
};