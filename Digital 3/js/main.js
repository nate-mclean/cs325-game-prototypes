
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
    game.load.image('home','assets/home.jpg');
    game.load.image('house2','assets/Poffin_House.png');
    game.load.image('mansion','assets/mansion.png');
    game.load.image('shop','assets/shop.jpg');
    game.load.image('shed','assets/shed.png');
    game.load.image('church','assets/church.jpg');
    game.load.image('dude','assets/dude.png');
    game.load.audio('song', 'assets/song.mp3');

}

//globals

var music;
//sprite
var sprite;
var dude;
//world
var world;
var home;
var house2;
var church;
var mansion;
var shop;
var shed;
//text
var debug;
//state 
var state = "map";
var count = 0;
var gameCount = 0;
//boolean progress
var shoes =  false;
var healstone = 0;
var money = 0;
var key = 0;

function create() {

//music 
music = game.add.audio('song');
    music.play();

            //create world
            world = game.add.sprite(0, 0, 'world');
            game.physics.enable(world, Phaser.Physics.ARCADE);
            
    //debug text
    debug = game.add.text(0, 30, "", { font: "20px Arial", fill: "#ff0044", align: "center" });
    debug.setText("click to move");

}

function update() {
    
    
    //if exploring
    if(state === "map"){
        world.visible=true;
        
        //  only move when you click // if within bounds!
        if (game.input.mousePointer.isDown)
        {
            //debug
            //debug.setText("input X: " + game.input.x +"\nworld.body.x: "+ world.body.x+
             //           "\ninput Y: " + game.input.y +"\nworld.body.y: "+ world.body.y);
            
            //click on doors.  5 cases for each location.  home house, house 2, church, shop, mansion
            //location is relative and based on game input location * scale + world.x (world.body.x ?) * scale
            //each brings new screen up with clickable overhead view
            var click_x = game.input.x + world.body.x*-1; //(0-600 + 0-2360)
            var click_y = game.input.y + world.body.y*-1; //(0-600 + 0-2360)
            
            //door 1, home. yellow hay roof
            if((click_x > 350 && click_x<395) && (click_y > 380 && click_y<500) && (key < 2 )){
                debug.setText("Home door");
                state = "home";
                world.visible = false;
                gameCount = 0;
                shoes = true;
                }
            //door 2, house 2
            else if((click_x > 1430 && click_x<1480) && (click_y > 420 && click_y<540) && (key < 2 )){
                debug.setText("House 2 door");
                state = "house2";
                world.visible = false;
                gameCount = 0;
                }
            //door 3, church
            else if((click_x > 2000 && click_x<2260) && (click_y > 460 && click_y<580) && (key < 2 )){
                debug.setText("Church door");
                state = "church";
                world.visible = false;
                gameCount = 0;
                }
            //door 4, shop
            else if((click_x > 1870 && click_x<1930) && (click_y > 1270 && click_y<1390) && (key < 2 )) {
                debug.setText("Shop door");
                state = "shop";
                world.visible = false;
                gameCount = 0;
                }
            //door 5, shed
            else if((click_x > 100 && click_x<230) && (click_y > 1450 && click_y<1560) && (key < 2 )){
                debug.setText("Shed door");
                state = "shed";
                world.visible = false;
                gameCount = 0;
                }
            //door 6, mansion
            else if((click_x > 500 && click_x<600) && (click_y > 1350 && click_y<1470) && (key > 0 )){
                debug.setText("Mansion door");
                state = "mansion";
                world.visible = false;
                gameCount = 0;
                }
                          //move around world following mouse location
            else{
                if(!shoes)
                    world.body.velocity.setTo(-1*(game.input.x-300), -1*(game.input.y-300));
                else if(shoes)
                    world.body.velocity.setTo(-2*(game.input.x-300), -2*(game.input.y-300));
                }
          }
        else
        {
            world.body.velocity.setTo(0, 0);
        }
    
    }
    //kill vel if not on map
    if(state != "map")
        world.body.velocity.setTo(0, 0);
    
    //go into house 1, home
    if(state === "home") {
        
        if(gameCount === 0){
            home = game.add.sprite(100,100,'home');
            //click actions on each enviroment
            home.inputEnabled = true;
            home.events.onInputDown.add(listener, this);
        }
        gameCount++;
               
        //leave house after dialog
        if(count === 10){
            state="map";    
            home.destroy();
            gameCount = 0;
            count = 0;
         }   
    }
    
    //go into house 2
        if(state === "house2") {
        if(gameCount === 0){
            house2 = game.add.sprite(50,100,'house2');
            //click actions on each enviroment
            house2.inputEnabled = true;
            house2.events.onInputDown.add(listener2, this);
        }
        gameCount++;
               
        //leave house after dialog
        if(count === 7){
            state="map";    
            house2.destroy();
            gameCount = 0;
            count = 0;
         }   
    }
    
        //go into church
        if(state === "church") {
        if(gameCount === 0){
            church = game.add.sprite(100,100,'church');
            //click actions on each enviroment
            church.inputEnabled = true;
            church.events.onInputDown.add(listener3, this);
        }
        gameCount++;
               
        //leave house after dialog
        if(count === 7){
            state="map";    
            church.destroy();
            gameCount = 0;
            count = 0;
         }   
    }
    
    
        //go into shop
        if(state === "shop") {
        if(gameCount === 0){
            shop = game.add.sprite(50,100,'shop');
            //click actions on each enviroment
            shop.inputEnabled = true;
            shop.events.onInputDown.add(listener4, this);
        }
        gameCount++;
               
        //leave house after dialog
        if(count === 5){
            state="map";    
            shop.destroy();
            gameCount = 0;
            count = 0;
         }   
    }
            //go into mansion
        if(state === "mansion") {
        if(gameCount === 0){
            mansion = game.add.sprite(-100,60,'mansion');
            //click actions on each enviroment
            mansion.inputEnabled = true;
            mansion.events.onInputDown.add(listener5, this);
        }
        gameCount++;
               
        //leave house after dialog
        if(count === 6){
            state="map";    
            mansion.destroy();
            gameCount = 0;
            count = 0;
         }   
    }
            //go into shed
        if(state === "shed") {
        if(gameCount === 0){
            shed = game.add.sprite(150,100,'shed');
            //click actions on each enviroment
            shed.inputEnabled = true;
            shed.events.onInputDown.add(listener6, this);
        }
        gameCount++;
               
        //leave house after dialog
        if(count === 1){
            state="map";    
            shed.destroy();
            gameCount = 0;
            count = 0;
         }   
    }





}

function listener () {

    if(count === 0)
    debug.setText("I miss my son so much..");
    if(count === 1)
    debug.setText("He dissapeared so suddenly.  It's almost like I can feel his presence.");
    if(count === 2)
    debug.setText("Hello?? Anyone there??");
    if(count === 3)
    debug.setText(". . . .");
    if(count === 4)
    debug.setText("Oh well.. I was about to give him these brand new running shoes.");
    if(count === 5)
    debug.setText("I guess I'll just leave them by the door.");
    if(count === 6)
    debug.setText("** you pick up the running shoes **");
    if(count === 7)
    debug.setText("Huh? That's funny.. I thought I put them there..");
    if(count === 8)
    debug.setText("** aquired running shoes **");

    count++;

}
function listener2 () {

    if(healstone === 0){
    if(count === 0)
    debug.setText("Old Man: Old lady Jenkins, how are you feeling?");
    if(count === 1)
    debug.setText("Old Lady: not so good...");
    if(count === 2)
    debug.setText("Old Lady: Hello?? Did someone come in??");
    if(count === 3)
    debug.setText("Old man: No one came in.. please calm down");
    if(count === 4)
    debug.setText("Old Lady: It feels like an angel.. maybe it will help");
    if(count === 5)
    debug.setText("Old man: At this point, that's all we have left");
      }
          if(healstone === 1){
    if(count === 0)
    debug.setText("** places healing stone down **");
    if(count === 1)
    debug.setText("Old Man: What's that?? *picks up stone*");
    if(count === 2)
    debug.setText("Old woman: That is a sacred healing stone..");
        if(count === 3)
    debug.setText("Old woman: It will cure my sickness.");
        if(count === 4)
    debug.setText("Old man: Praise be!! A miracle!");
            if(count === 5)
    debug.setText("Old woman: Thank you whoever you are");
              if(count === 6){
    debug.setText("** Aquired Money **");  
    healstone++;
    money++;
    }
    }
              if(healstone === 2){
    if(count === 0)
    debug.setText("Old woman: I finally have energy again!");
    if(count === 1)
    debug.setText("Old Man: I can see it in your eyes");
    if(count === 2)
    debug.setText("Old woman: ...");
        if(count === 3)
     debug.setText("Old woman: ... I feel his presence again");
            if(count === 4)
    debug.setText("Old woman: Thank you whoever you are");
    }

count++;
}
function listener3 () {

        if(healstone === 0){
    if(count === 0)
    debug.setText("Priest: Ahh.. I feel the presence of the angel");
    if(count === 1)
    debug.setText("Priest: I will give you this healing stone");
    if(count === 2)
    debug.setText("Priest: Use it wisely..");
    if(count === 3)
    debug.setText("** Places down healing stone **");
    if(count === 4)
    debug.setText("** You pick up the healing stone **");
    if(count === 5){
    debug.setText("** Healing stone aquired **");
    healstone++;
    }
    }
            if(healstone > 0){
    if(count === 0)
    debug.setText("Priest: Back again?");
    if(count === 1)
    debug.setText("Priest: Rest my angel");
    if(count === 2)
    debug.setText("Priest: I know you will find your mission");
      }
      
    count++;

}
function listener4 () {

    if(money === 0 )
    {
    if(count === 0)
        debug.setText("Man: I need money!!");
        if(count === 1)
        debug.setText("Man: I'll give you my best item");
        if(count === 2)
        debug.setText("Man: This mysterious key..");
    }
        if(money === 1 )
    {
        if(count === 0)
        debug.setText("** places money down **");
        if(count === 1)
        debug.setText("Man: !!!! Where did you come from ??");
        if(count === 2)
        debug.setText("** Man grabs money **");
        if(count === 3)
            debug.setText("Man: Guess I'll just put out your prize");
                   if(count === 4){
            debug.setText("** Old key aquired **");
           money++;
            key++;
            }

            
    }
           if(money === 2 )
    {
        if(count === 0)
        debug.setText("Man: the key disapeared!");
        if(count === 1)
        debug.setText("Man: That's good you got your reward");
        if(count === 2)
        debug.setText("Whoever you are..");

            }
              count++;  
    }
function listener5 () {

               if(key === 1 )
    {
        if(count === 0)
        debug.setText("** The old key opened the door **");
        if(count === 1)
        debug.setText("** You find a magic Potion **");
        if(count === 2)
        debug.setText("** You take the potion **");
        if(count === 3)
        debug.setText(" . . . ");
        if(count === 4){
        debug.setText("** You become visible!! **");
        dude = game.add.sprite(300,300,'dude');
        }
        if(count === 5){
        debug.setText("The End");
        key++;
        }
            }
                           if(key === 2 )
    {
        if(count === 0)
        debug.setText("** The old key opened the door **");
        if(count === 1)
        debug.setText("The End");

        }

    count++;
                }


function listener6 () {

    count++;

}
};
