
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

    this.load.spritesheet('dice', 'assets/diceroll.png', 100, 100, 6);
    this.load.image('addbutton', 'assets/addbutton.png');
    this.load.image('removebutton', 'assets/removebutton.png');
    this.load.image('upgradebutton', 'assets/upgradebutton.png');
    this.load.image('nextbutton', 'assets/nextbutton.png');
    this.load.image('nextdaybutton', 'assets/nextdaybutton.png');
    this.load.image('rollbutton', 'assets/rollbutton.png');
    this.load.image('newgamebutton', 'assets/newgameButton.png');
    this.load.image('bkg', 'assets/bkg.png');
   this.load.audio('song', 'assets/song.mp3');


}

//globals

//rolling
var rolltest = false;
var i = 0;


var music;
//sprites
var addBcat;
var removeBcat;
var addBdog;
var removeBdog;
var addBfish;
var removeBfish;
var upB;
var nextB;
var rollB;
var rollMax = 3;
var rollBcount = 0;
var newgameB;
var upgradeB;
var upgradeBroll;
var upgradeBstore;
var bkg;

//text
var money;
var day;
var cats;
var dogs;
var fish;
var roll;
var endgame;
var rand;
var win;
var upgrade;
var dice;

//text data
var moneyCount = 250;
var dayCount = 1;
var store = 1;
var catCount = 0;
var fishCount = 0;
var dogCount = 0;


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


//create game enviroment
bkg = game.add.sprite(0, 0, 'bkg');

addBcat = game.add.sprite(180, 200, 'addbutton');
addBcat.inputEnabled = true;
removeBcat = game.add.sprite(10, 200, 'removebutton');
removeBcat.inputEnabled = true;

addBdog = game.add.sprite(550, 200, 'addbutton');
addBdog.inputEnabled = true;
removeBdog = game.add.sprite(380, 200, 'removebutton');
removeBdog.inputEnabled = true;

addBfish = game.add.sprite(900, 200, 'addbutton');
addBfish.inputEnabled = true;
removeBfish = game.add.sprite(730, 200, 'removebutton');
removeBfish.inputEnabled = true;

rollB = game.add.sprite(400, 400, 'rollbutton');
rollB.inputEnabled = true;

upgradeB =  game.add.sprite(400, 400, 'nextbutton');
upgradeB.inputEnabled = true;
upgradeB.visible = false;

upgradeBroll =  game.add.sprite(550, 400, 'upgradebutton');
upgradeBroll.inputEnabled = true;
upgradeBroll.visible = false;

upgradeBstore =  game.add.sprite(550, 500, 'upgradebutton');
upgradeBstore.inputEnabled = true;
upgradeBstore.visible = false;

nextB =  game.add.sprite(600, 10, 'nextdaybutton');
nextB.inputEnabled = true;
nextB.visible = false;


newgameB = game.add.sprite(350, 450, 'newgamebutton');
newgameB.inputEnabled = true;
newgameB.visible = false;

//dice!!
dice = game.add.sprite(280, 430, 'dice' );
dice.visible=false;


//game text
    var labels = game.add.text(50, 140, "cats (-$50)            dogs (-$100)            fish (-$25)", { font: "42px Arial", fill: "#000000", align: "center" });
    money = game.add.text(50, 30, "", { font: "50px Arial", fill: "#000000", align: "center" });
    money.setText("Money: $" + moneyCount);
    day = game.add.text(420, 30, "", { font: "60px Arial", fill: "#000000", align: "center" });
    day.setText("Day " + dayCount);
    //endgame = game.add.text(330, 200, "Increase regulations to \nenable rapid tree growth,\n grow 25 trees \nto save the forest!!", { font: "60px Arial", fill: "#000000", align: "center" });
    
    
    //cat, dog, fish amounts
    cats = game.add.text(130, 220, catCount, { font: "60px Arial", fill: "#000000", align: "center" });
    dogs = game.add.text(500, 220, dogCount, { font: "60px Arial", fill: "#000000", align: "center" });
    fish = game.add.text(850, 220, fishCount, { font: "60px Arial", fill: "#000000", align: "center" });

    //roll text
    roll = game.add.text(420, 520, "Rolls per turn: "+rollMax, { font: "30px Arial", fill: "#000000", align: "center" });
    rand = game.add.text(650, 450, "", { font: "30px Arial", fill: "#000000", align: "center" });
    win = game.add.text(350, 330, "upgrade to store 3/3\n                        to win", { font: "40px Arial", fill: "#000000", align: "center" });
    //upgrade text
    upgrade = game.add.text(50, 420, "", { font: "45px Arial", fill: "#000000", align: "center" });
    

}

function update() {
    //update text fields
        money.setText("Money: $" + moneyCount);
        cats.setText(catCount);
        dogs.setText(dogCount);
        fish.setText(fishCount);
        day.setText("Day " + dayCount);  
              
    //grey out buttons if unusable
        if(moneyCount < 50)
            addBcat.alpha = .2;
        else
            addBcat.alpha = 1; 
        if(catCount < 1)
            removeBcat.alpha = .2;
        else
            removeBcat.alpha = 1; 
        if(moneyCount < 100)
            addBdog.alpha = .2;
        else
            addBdog.alpha = 1; 
        if(dogCount < 1)
            removeBdog.alpha = .2;
        else
            removeBdog.alpha = 1; 
        if(moneyCount < 25)
            addBfish.alpha = .2;
        else
            addBfish.alpha = 1; 
        if(fishCount < 1)
            removeBfish.alpha = .2;
        else
            removeBfish.alpha = 1; 
        if(moneyCount < 100)
            upgradeBroll.alpha = .2;
        else
            upgradeBroll.alpha = 1;
        if(moneyCount < 500)
            upgradeBstore.alpha = .2;
        else
            upgradeBstore.alpha = 1; 

    
    //cat button click
        addBcat.events.onInputDown.add(addButtoncat, this);
        removeBcat.events.onInputDown.add(removeButtoncat, this);
    //dog button click
        addBdog.events.onInputDown.add(addButtondog, this);
        removeBdog.events.onInputDown.add(removeButtondog, this);
    //fish button click
        addBfish.events.onInputDown.add(addButtonfish, this);
        removeBfish.events.onInputDown.add(removeButtonfish, this);
    //roll button
        rollB.events.onInputDown.add(rollButton, this);
    //upgarde button
        upgradeB.events.onInputDown.add(upgradeButton, this);
    //upgrade roll, store
    upgradeBroll.events.onInputDown.add(upgradeButtonroll, this);
    upgradeBstore.events.onInputDown.add(upgradeButtonstore, this);
    //next day
        nextB.events.onInputDown.add(nextButton, this);
    //ew game
        newgameB.events.onInputDown.add(newgameButton, this);
        
    //roll dice delay
     if(rolltest === true){
         i++;
         rollB.alpha = .2;
         rollB.inputEnabled  = false;
         if(i>50){
             rolltest=false;
             i=0;
             rolldice();
             }
         }
}

//cat click
function addButtoncat () {
    //update money and amount of animal
    if(moneyCount >= 50){
    moneyCount -= 50;
    catCount++;
    }
}
function removeButtoncat () {
    //update money and amount of animal
    if(catCount > 0){
    moneyCount += 50;
    catCount--;
    }
}
//dog click
function addButtondog () {
    //update money and amount of animal
    if(moneyCount >= 100){
    moneyCount -= 100;
    dogCount++;
    }
}
function removeButtondog () {
    //update money and amount of animal
    if(dogCount > 0){
    moneyCount += 100;
    dogCount--;
    }
}
//fish click
function addButtonfish () {
    //update money and amount of animal
    if(moneyCount >= 25){
    moneyCount -= 25;
    fishCount++;
    }
    if(fishCount>=10)
    fish.x = 830;
}
function removeButtonfish () {
    //update money and amount of animal
    if(fishCount > 0){
    moneyCount += 25;
    fishCount--;
    }
    if(fishCount<10)
    fish.x = 850;
}
//roll button
function rollButton () {
    //increment count
    rollBcount++;
    //diceroll animation
    rolltest = true;
    dice.visible=true;
    var roll = dice.animations.add('roll');
    dice.animations.play('roll', 10, true);

    
    
    //remove other buttons if first click
    if(rollBcount == 1){
        addBcat.visible=false;
        removeBcat.visible=false;
        addBdog.visible=false;
        removeBdog.visible=false;
        addBfish.visible=false;
        removeBfish.visible=false;
        }
    }
    
    

function rolldice() {
        dice.animations.stop(null, true);
        if(rollBcount >= rollMax){
    upgradeB.visible = true;
    rollB.visible =false; 
    roll.setText("");
    rollhelp();
    }
    else{
    rand.setText("       1=dog\n3=cat\neven=fish");
        roll.setText("rolls left: "+(rollMax-rollBcount));
        rollhelp();
    }
    }
function rollhelp() {
        //get random roll
        rollB.alpha = 1;
        rollB.inputEnabled  = true;
    var num = Math.floor(Math.random()*6 + 1);
    dice.visible=true;
    dice.frame = num - 1;
    
    //check if can make money on roll
    if((num==2 || num==4 || num==6) && fishCount>0 ) {
        fishCount--;
        moneyCount+=50;
        win.setText("you sold a fish! +$50");
        }
    else if(num==3 && catCount>0 ) {
        catCount--;
        moneyCount+=100;
        win.setText("you sold a cat! +$100");
        }
    else if(num==1 && dogCount>0 ) {
        dogCount--;
        moneyCount+=200;
        win.setText("you sold a dog! +$200");
        }
    else
        win.setText("");

    }
function upgradeButton() {
        dice.visible=false;
    upgrade.setText("buy one more roll (-$100) \n\n upgrade store (-$500)");
    win.setText("store level " + store + "/3");
    upgradeBroll.visible = true;
    upgradeBstore.visible = true;
    nextB.visible = true;
    upgradeB.visible = false;
    rollBcount = 0;
     roll.setText("");
     rand.setText("");
    }
function upgradeButtonroll() {
 
 if(moneyCount >= 100){
     moneyCount -= 100;
     rollMax++;
     }
    }
function upgradeButtonstore() {
  if(moneyCount >= 500){
     moneyCount -= 500;
     store++;
     }
   win.setText("store level " + store + "/3");
   
   if(store == 3){
       upgradeBroll.visible = false;
    upgradeBstore.visible = false;
    upgrade.setText("");
    nextB.visible = false;
    win.setText("You win!");
    newgameB.visible=true;
    }
    }


function nextButton() {
    dayCount++;
    upgrade.setText("");
    win.setText("$50 paid for rent");
    moneyCount -= 50;
    
    upgradeBroll.visible = false;
    upgradeBstore.visible = false;
    nextB.visible = false;
    
    if(moneyCount >=0 ) {
    roll.setText("Rolls per turn: "+rollMax);
    rollB.visible=true;
            addBcat.visible=true;
        removeBcat.visible=true;
        addBdog.visible=true;
        removeBdog.visible=true;
        addBfish.visible=true;
        removeBfish.visible=true;
        }
        else{ //game lose!!
        win.setText("Game over! \nYou couldn't pay rent!");
        moneyCount = 0;
        newgameB.visible=true;
        }
    }
    function newgameButton() {
    newgameB.visible=false;
    store=1;
    catCount=0;
    dogCount=0;
    fishCount = 0;
    rollMax = 3;
    
    dayCount = 1;
    upgrade.setText("");
    win.setText("");
    moneyCount = 250;
    
    upgradeBroll.visible = false;
    upgradeBstore.visible = false;
    nextB.visible = false;
    
    roll.setText("Rolls per turn: "+rollMax);
    rollB.visible=true;
            addBcat.visible=true;
        removeBcat.visible=true;
        addBdog.visible=true;
        removeBdog.visible=true;
        addBfish.visible=true;
        removeBfish.visible=true;

    }


}
